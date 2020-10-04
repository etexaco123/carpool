FROM mhart/alpine-node:12

# Create app directory
WORKDIR /usr/src/app

## install simple http server for serving static content
#RUN npm install -g http-server

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Run with yarn
RUN yarn install

## Run with npm
#RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "yarn", "serve" ]
