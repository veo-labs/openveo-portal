# OpenVeo Portal

Openveo Portal interacts with a Web Service exposed by an [OpenVeo](https://github.com/veo-labs/openveo-core) server associated to an [OpenVeo Publish](https://github.com/veo-labs/openveo-publish) plugin.

# Install OpenVeo Portal

    # Extract OpenVeo Portal package (this will create a directory)
    tar -xvf openveo-portal.tar

    # Install OpenVeo Portal
    cd openveo-portal
    npm install

**Nb :** You will be prompted for some configuration. Don't worry if you made an error, you can edit configuration anytime using [advanced configuration](advanced-configuration).

# Install a custom theme

By default, OpenVeo Portal comes from a default theme. If this theme does not suite your graphical interface, you can customize OpenVeo Portal with your own theme and install it into **assets/themes**.

    cd assets/themes
    tar -xvf my-theme.tar

# Launch the application

OpenVeo Portal is now installed. Launch it :

    node server.js
