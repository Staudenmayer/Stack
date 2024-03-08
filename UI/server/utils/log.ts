import graylog2 from "graylog2";

export default new graylog2.graylog({
  servers: [
    {
      host: (process.env.GRAYLOG_HOST as string) || "127.0.0.1",
      port: parseInt(process.env.GRAYLOG_PORT as string) || 12201,
    },
  ],
  facility: "api",
});
