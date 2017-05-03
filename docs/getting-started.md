# OpenVeo Portal

Openveo Portal interacts with a Web Service exposed by an [OpenVeo](https://github.com/veo-labs/openveo-core) server associated to an [OpenVeo Publish](https://github.com/veo-labs/openveo-publish) plugin.

# Download OpenVeo Portal

Actually OpenVeo Portal can be downloaded directly from [github](https://github.com/veo-labs/openveo-portal):

- Select the tag you want to download (**from version >=2.0.0**)
- Then download the associated archive
- Deploy the archive on your server

# Install OpenVeo Portal

From OpenVeo Portal root directory:

    npm install --production

**Nb :** You will be prompted for some configuration. Don't worry if you made an error, you can edit configuration anytime using [advanced configuration](advanced-configuration).

# Install a custom theme

By default, OpenVeo Portal comes with a default theme. If this theme does not suite your graphical interface, you can customize OpenVeo Portal with your own theme and install it into **assets/themes**.

# Launch the application

OpenVeo Portal is now installed. Launch it:

    node server.js
