import { Application } from "express";
import elasticsearch from "elasticsearch";
import User from "./models/users.model";

const index = "users";

const client = new elasticsearch.Client({
  host: "localhost:9200",
  log: "trace"
});

export default client;

export function elasticsearchInit(app: Application) {
  app.set("elasticsearchClient", client);

  client.indices
    .exists({ index })
    .then(indexExists => {
      if (indexExists) {
        return client.indices.delete({ index });
      }
    })
    .then(() => client.indices.create({ index }))
    .then(() =>
      User.findAll().then(users => {
        users.map(user => user.dataValues).forEach(user => {
          client.index({
            index,
            type: "user",
            id: user.id,
            body: {
              first_name: user.first_name,
              last_name: user.last_name,
              location: user.location
            }
          });
        });
      })
    );
}
