FROM golang:1.14-alpine AS build
LABEL maintainer="zekro <contact@zekro.de>"

WORKDIR /build

RUN apk add --update \
        nodejs npm git

ADD . .

RUN cd web &&\
    npm ci &&\
    npm run build

RUN go build \
        -o tonic \
        ./cmd/tonic/*.go


FROM alpine:latest AS final

COPY --from=build /build/tonic /app/tonic
COPY --from=build /build/web/build /app/web

RUN mkdir -p /etc/certs &&\
    mkdir -p /var/img &&\
    mkdir -p /tmp/thumbnails
RUN chmod +x /app/tonic

ENV TONIC_WEBDIR="/app/web" \
    TONIC_IMAGELOCATION="/var/img" \
    TONIC_ADDRESS="localhost:8080" \
    TONIC_DEBUG="false" \
    TONIC_THUMBNAILCACHE="/tmp/thumbnails"

EXPOSE 8080

ENTRYPOINT ["/app/tonic"]
