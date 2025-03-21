FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN npm i -D @sveltejs/adapter-static
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]