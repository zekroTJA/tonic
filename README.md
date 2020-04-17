# tonic

tonic is a zero-storage web application for managing file actions of a local storage of public images. Zero-storage means that, after configuration, no persistent storage is required like a database or flat file storage.

So, this is a really simple, single user image manager. If you are looking for something more complex and functional, take a look on [this open source approach](https://github.com/imagineOSS) which is currently under development.

![](.github/media/preview.gif)

## Technical Details

Basic authentication is done by a by config predefined password or password hash which is sent on login via the REST API. After successful password check, a [JWT](https://jwt.io/introduction) is created and signed with a randomly generated key, which is initialized on startup, and then stored as HTTP cookie. This cookie will be sent and validated on each following REST request.

The front end SPA *(Single Page Application)* is created with [React](https://reactjs.org), [React Router](https://reacttraining.com/react-router) and [material-ui](https://github.com/mui-org/material-ui).

The REST API backend and file management is created with [Go](https://golang.org) and [Gin](https://github.com/gin-gonic/gin) as web server wrapper.

The back end creates and caches *(if configured)* image thumbnails for faster dashboard loading times using [nfnt/resize](https://github.com/nfnt/resize). These thumbnail files are, if cached, saved inside the container space, by default, and will be deleted on container recreate. However, if you want to have persistent cache, just bind the cache location to a volume.

Here, you can find the full list of dependencies used for the back end:  
https://github.com/zekroTJA/tonic/blob/master/go.mod

---

## Setup

The recommendet way to set up tonic is by using either the automatically built [docker image](https://hub.docker.com/r/zekro/tonic) or by building the image yourself using the provided [Dockerfile](https://github.com/zekroTJA/tonic/blob/master/Dockerfile).

Then, just create and start up the container:
```bash
$ docker run -d \
  --name tonic \
  -p 8080:8080 \
  -e 'TONIC_ADDRESS=tonic:8080' \
  -e 'TONIC_PASSWORD=$2a$10$9Ff...' \
  -v "/var/www/html/screenshots:/var/img" \
  -v "$PWD/tonic/cache:/tmp/thumbnails" # ignore this line if you 
                                        # don't want persistent cache
```

Or, simply using docker-compose:
```yml
version: '3.7'

# Ignore this, if you don't want persistent
# thumbnail cache
volumes:
  tonic-cache:

services:
  tonic:
    image: 'zekro/tonic:latest'
    ports:
      - '80:8080'
    environment:
      TONIC_ADDRESS:  'tonic:8080'
      TONIC_PASSWORD: '$$2a$$10$$9Ff...'
    volumes:
      - '/var/www/html/screenshots:/var/img'
      # Ignore this, if you don't want persistent
      # thumbnail cache
      - 'tonic-cache:/tmp/thumbnails'
    restart: always
```

### Password

You can use either a clear text password has `TONIC_PASSWORD` or a bcrypt hash of a password.  

You can use [bcrypt-generator.com](https://bcrypt-generator.com/) to generate a hash or simply use the hasher deployed within the tonic image:
```
$ docker-compose exec tonic hasher -c 14 -s -e 'MyPassword'
> $$2a$$14$$EkLKvDK0/MJHsAx3v/3n5eEgXYX.qqYuEOLkJs7I7oPMODMQcI.aa
```
*You output will differ becasue bcrypt naturally uses salts within the hash.*

Keep in mind that dollar signs (`$`) needs to be doubled when used as environment variable values inside the docker-compose.yml. Use the flag `-e` of the hasher tool which will then automatically escape the hash for you.

### Persistent Session Keys

Defaultly, tonic generates a random 256bit key on startup which will then be used for signing the JWT session keys. That also means, that all logins are getting invalid after restart. If you want to avoid this, you can set a persistent JWT key by setting the `TONIC_JWTSECRET` environment variable.

---

© 2020 Ringo Hoffmann (zekro Development)  
Covered by MIT Licence.
