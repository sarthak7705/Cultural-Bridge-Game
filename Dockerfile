FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm build

RUN pnpm add -g serve

EXPOSE 5000

CMD ["serve", "-s", "dist", "-l", "5000"]
