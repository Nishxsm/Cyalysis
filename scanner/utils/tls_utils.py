import socket
import ssl
from urllib.parse import urlparse


DEFAULT_TIMEOUT = 10


def get_tls_information(target):
    parsed = urlparse(target)

    hostname = parsed.hostname
    port = parsed.port or 443

    if not hostname:
        return {
            "success": False,
            "error": "Unable to determine target hostname."
        }

    context = ssl.create_default_context()

    try:
        with socket.create_connection(
            (hostname, port),
            timeout=DEFAULT_TIMEOUT
        ) as raw_socket:

            with context.wrap_socket(
                raw_socket,
                server_hostname=hostname
            ) as tls_socket:

                certificate = tls_socket.getpeercert()
                cipher = tls_socket.cipher()

                return {
                    "success": True,
                    "hostname": hostname,
                    "port": port,
                    "certificate": certificate,
                    "tls_version": tls_socket.version(),
                    "cipher": {
                        "name": cipher[0] if cipher else None,
                        "protocol": cipher[1] if cipher else None,
                        "bits": cipher[2] if cipher else None
                    },
                    "peer_certificate_binary": tls_socket.getpeercert(
                        binary_form=True
                    )
                }

    except ssl.SSLCertVerificationError as error:
        return {
            "success": False,
            "error": f"TLS certificate verification failed: {error}",
            "certificate_verification_failed": True
        }

    except ssl.SSLError as error:
        return {
            "success": False,
            "error": f"TLS connection failed: {error}",
            "ssl_error": True
        }

    except socket.timeout:
        return {
            "success": False,
            "error": "TLS connection timed out."
        }

    except OSError as error:
        return {
            "success": False,
            "error": f"Unable to establish TLS connection: {error}"
        }