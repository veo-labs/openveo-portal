# Introduction

All server logs are performed by module [Winston](https://github.com/winstonjs/winston).

# Use OpenVeo Portal logger

By default OpenVeo Portal creates one logger named **portal**. You can use this logger using the following code:

```javascript
process.logger.silly('Silly log');
process.logger.debug('Debug log');
process.logger.verbose('Verbose log');
process.logger.info('Info log');
process.logger.warn('Warn log');
process.logger.error('Error log');
```
