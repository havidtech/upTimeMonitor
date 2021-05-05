# upTimeMonitor
Following up a NodeJS course from PIRPLE. Adjusting the codes to be v14 compliant

upTimeMonitor aims to assist with knowing the condition of your website(s), that is, whether it is UP or DOWN

changes made to pirple's version
    1. Changed truncate to ftruncate since file descriptor is used to refer to the file
    2. Got a parsed url by using the new URL class rather than url.parse().
    3. Used searchParams property of URL rather than query property of url.parse().
