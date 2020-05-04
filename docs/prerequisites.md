OpenVeo Portal requires and has been tested on:

- [Openveo](https://github.com/veo-labs/openveo-core) (**&gt;=9.0.0**) with [Openveo Publish Plugin](https://github.com/veo-labs/openveo-publish) (**&gt;=11.0.0**) - OpenVeo Portal retrieves all its videos from an OpenVeo server. OpenVeo must grant the following scopes to OpenVeo Portal: **Get groups**, **Get taxonomies**, **Get properties**, **Increase video views**, **Get videos**
- [Node.js](https://nodejs.org/en/) (**&gt;=12.4.0**) - The server side of OpenVeo Portal is written in Node.js
- [Npm](https://www.npmjs.com/) (**&gt;=6.9.0**) - Npm is used to install OpenVeo Portal dependencies
- [MongoDB](https://www.mongodb.org/) (**&gt;=3.0.0**) - OpenVeo Portal stores user sessions in a MongoDB database

**NB:** Moreover, for a Windows installation, Visual Studio Express is required as some OpenVeo dependencies are written in C and need to be compiled. For Linux you may have to install the package libkrb5-dev.
