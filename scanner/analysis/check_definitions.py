CHECK_DEFINITIONS = {

    # TARGET OPERATIONS

    "URL Validation": {
        "category": "Target",
        "type": "observation",
        "description": "Validates the structure and protocol of the target URL.",
    },

    "Domain Resolution": {
        "category": "Target",
        "type": "observation",
        "description": "Determines whether the target domain can be resolved.",
    },

    "IP Resolution": {
        "category": "Target",
        "type": "observation",
        "description": "Identifies IP addresses associated with the target domain.",
    },

    "Port Identification": {
        "category": "Target",
        "type": "observation",
        "description": "Identifies the expected HTTP or HTTPS service port.",
    },



    # DNS

    "DNS A Record": {
        "category": "DNS",
        "type": "observation",
        "description": "Retrieves IPv4 A records for the target domain.",
    },

    "DNS AAAA Record": {
        "category": "DNS",
        "type": "observation",
        "description": "Retrieves IPv6 AAAA records for the target domain.",
    },

    "DNS CNAME Record": {
        "category": "DNS",
        "type": "observation",
        "description": "Checks for canonical name records associated with the target.",
    },

    "DNS MX Record": {
        "category": "DNS",
        "type": "observation",
        "description": "Identifies mail exchange servers configured for the domain.",
    },

    "DNS NS Record": {
        "category": "DNS",
        "type": "observation",
        "description": "Identifies authoritative name servers for the domain.",
    },

    "DNS TXT Record": {
        "category": "DNS",
        "type": "observation",
        "description": "Retrieves TXT records published by the target domain.",
    },



    # HTTP

    "HTTP Status Analysis": {
        "category": "HTTP",
        "type": "observation",
        "description": "Analyzes the HTTP response status returned by the target.",
    },

    "HTTPS Availability": {
        "category": "HTTP",
        "type": "security_control",
        "description": "Checks whether the target is accessible over HTTPS.",
    },

    "HTTPS Enforcement": {
        "category": "HTTP",
        "type": "security_control",
        "description": "Checks whether HTTP requests are redirected to HTTPS.",
    },

    "Redirect Chain": {
        "category": "HTTP",
        "type": "observation",
        "description": "Analyzes the sequence of redirects returned by the target.",
    },

    "Response Headers": {
        "category": "HTTP",
        "type": "observation",
        "description": "Collects and analyzes HTTP response headers.",
    },

    "Server Banner": {
        "category": "HTTP",
        "type": "security_control",
        "description": "Checks whether the response exposes a server banner.",
    },

    "Response Time": {
        "category": "HTTP",
        "type": "observation",
        "description": "Measures the response time of the target.",
    },

    "Content-Type": {
        "category": "HTTP",
        "type": "security_control",
        "description": "Checks whether the target provides a Content-Type response header.",
    },


    # TECHNOLOGY DETECTION

    "Web Server Detection": {
        "category": "Technology",
        "type": "observation",
        "description": "Identifies the web server technology exposed by the target.",
    },

    "Framework Detection": {
        "category": "Technology",
        "type": "observation",
        "description": "Attempts to identify web application frameworks used by the target.",
    },

    "CMS Detection": {
        "category": "Technology",
        "type": "observation",
        "description": "Attempts to identify content management systems used by the target.",
    },

    "Library Detection": {
        "category": "Technology",
        "type": "observation",
        "description": "Attempts to identify client-side libraries used by the target.",
    },

    "CDN Detection": {
        "category": "Technology",
        "type": "observation",
        "description": "Attempts to identify content delivery network infrastructure.",
    },


    # SECURITY HEADERS

    "CSP Analysis": {
        "category": "Security Headers",
        "type": "security_control",
        "description": "Checks the presence and configuration of Content-Security-Policy.",
    },

    "HSTS Analysis": {
        "category": "Security Headers",
        "type": "security_control",
        "description": "Checks the presence of Strict-Transport-Security.",
    },

    "X-Content-Type Analysis": {
        "category": "Security Headers",
        "type": "security_control",
        "description": "Checks X-Content-Type-Options configuration.",
    },

    "Clickjacking Analysis": {
        "category": "Security Headers",
        "type": "security_control",
        "description": "Checks for browser controls that restrict unwanted framing.",
    },

    "Referrer Policy": {
        "category": "Security Headers",
        "type": "security_control",
        "description": "Checks the presence of a Referrer-Policy.",
    },

    "Permissions Policy": {
        "category": "Security Headers",
        "type": "security_control",
        "description": "Checks the presence of a Permissions-Policy.",
    },

    "Security Header Completeness": {
        "category": "Security Headers",
        "type": "security_control",
        "description": "Evaluates the completeness of the supported security headers.",
    },



    # COOKIES

    "Cookie Enumeration": {
        "category": "Cookies",
        "type": "observation",
        "description": "Enumerates cookies exposed through Set-Cookie response headers.",
    },

    "Cookie Security": {
        "category": "Cookies",
        "type": "security_control",
        "description": "Checks security-related cookie attributes.",
    },

    "SameSite Analysis": {
        "category": "Cookies",
        "type": "security_control",
        "description": "Checks the SameSite attribute of cookies.",
    },

    "Cookie Scope": {
        "category": "Cookies",
        "type": "observation",
        "description": "Analyzes cookie Domain and Path scope.",
    },

    "Cookie Expiration": {
        "category": "Cookies",
        "type": "observation",
        "description": "Analyzes cookie expiration and persistence attributes.",
    },



    # CORS

    "CORS Header": {
        "category": "CORS",
        "type": "observation",
        "description": "Checks for CORS-related response headers.",
    },

    "CORS Origin Policy": {
        "category": "CORS",
        "type": "security_control",
        "description": "Analyzes the Access-Control-Allow-Origin policy.",
    },

    "CORS Credential Policy": {
        "category": "CORS",
        "type": "security_control",
        "description": "Analyzes the Access-Control-Allow-Credentials policy.",
    },

    "CORS Method Analysis": {
        "category": "CORS",
        "type": "security_control",
        "description": "Analyzes methods exposed through CORS policy.",
    },

    "CORS Header Policy": {
        "category": "CORS",
        "type": "security_control",
        "description": "Analyzes headers exposed or permitted through CORS.",
    },



    # TLS

    "TLS Certificate": {
        "category": "TLS",
        "type": "security_control",
        "description": "Checks TLS certificate validity.",
    },

    "TLS Expiration": {
        "category": "TLS",
        "type": "security_control",
        "description": "Checks TLS certificate expiration information.",
    },

    "TLS Hostname": {
        "category": "TLS",
        "type": "security_control",
        "description": "Verifies that the TLS certificate matches the target hostname.",
    },

    "TLS Chain": {
        "category": "TLS",
        "type": "security_control",
        "description": "Analyzes TLS certificate chain information.",
    },

    "TLS Version": {
        "category": "TLS",
        "type": "security_control",
        "description": "Identifies the TLS protocol version negotiated with the target.",
    },

    "Cipher Configuration": {
        "category": "TLS",
        "type": "security_control",
        "description": "Identifies the negotiated TLS cipher configuration.",
    },


    # INFORMATION DISCLOSURE

    "Server Version Disclosure": {
        "category": "Information Disclosure",
        "type": "security_control",
        "description": "Checks whether server version information is exposed.",
    },

    "Technology Version Disclosure": {
        "category": "Information Disclosure",
        "type": "security_control",
        "description": "Checks whether technology version information is exposed.",
    },

    "Debug Information": {
        "category": "Information Disclosure",
        "type": "security_control",
        "description": "Checks for indicators of exposed debug information.",
    },

    "Verbose Error Analysis": {
        "category": "Information Disclosure",
        "type": "security_control",
        "description": "Checks for indicators of verbose error information.",
    },

    "Metadata Analysis": {
        "category": "Information Disclosure",
        "type": "security_control",
        "description": "Checks for notable metadata disclosure indicators.",
    },


  
    # HTTP METHODS
  
    "HTTP Method Enumeration": {
        "category": "HTTP Methods",
        "type": "security_control",
        "description": "Enumerates HTTP methods advertised by the target.",
    },

    "OPTIONS Analysis": {
        "category": "HTTP Methods",
        "type": "observation",
        "description": "Analyzes the response to an HTTP OPTIONS request.",
    },

    "Method Restriction": {
        "category": "HTTP Methods",
        "type": "security_control",
        "description": "Analyzes whether HTTP methods are appropriately restricted.",
    },

    "TRACE Analysis": {
        "category": "HTTP Methods",
        "type": "security_control",
        "description": "Checks whether the TRACE HTTP method is accepted.",
    },

    "Unsupported Methods": {
        "category": "HTTP Methods",
        "type": "security_control",
        "description": "Checks how the target handles an unsupported HTTP method.",
    },
}