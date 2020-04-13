# tonic

tonic is a zero-storage web application for managing file actions of a local storage of public images. Zero-storage means that. after configuration, no persistent storage is required like a database or flat file storage.

## Technical Details

Basic authentication is done by a by config predefined password which is sent on login via the REST API. After successful password check, a [JWT](https://jwt.io/introduction) is created and signed with a randomly generated key, which is initialized on startup, and then stored as HTTP cookie. This cookie will be sent and validated on each following REST request.

The front end SPA *(Single Page Application)* is created with [React](https://reactjs.org) and [React Router](https://reacttraining.com/react-router).

The REST API backend and file management is created with [Go](https://golang.org) and [Gin](https://github.com/gin-gonic/gin) as web server wrapper.

---

© 2020 Ringo Hoffmann (zekro Development)  
Covered by MIT Licence.
