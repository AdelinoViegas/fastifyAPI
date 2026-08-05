import Fastify from "fastify";
import cors from "@fastify/cors";
import { createConnection } from "mongoose";
import { Schema } from "mongoose";

//conectando ao banco de dados
const db = await createConnection("mongodb://localhost:27017/api");

//Esquema e Modelo do usuário
const userModel = db.model("User", new Schema({
  name: String, 
  email: String, 
  contact: String,
  age: Number
}, { 
  timestamps: true,
  collection: "users"
}));

const fastify = Fastify({logger: true});
await fastify.register(cors, { origin: "*"});

const usersData = [
  {id: 1, name: "Hacker Adelino Viegas", email: "adelino@example.com"},
  {id: 2, name: "Instrumentista Musical", email: "instrumentista@example.com"},
  {id: 3, name: "Engenheiro de Software", email: "engenheirosoftware@example.com"}
];

fastify.get("/", async (req, res) => {
  res.send({message: "Rota existente com sucesso!", status: true});
});

fastify.get("/users", async (req, res) => {
  const users = await userModel.find();
  return res.status(200).send(users);
});

fastify.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  const user = await userModel.findOne({ _id: id });

  if (!user) {
    return res.status(404).send({ message: "Usuário não encontrado", status: false });
  }

  return res.status(200).send({
    name: user.name,
    email: user.email,
    age: user.age,
    contact: user.contact
  });
});

fastify.delete("/users/:email", async (req, res) => {
  const { email } = req.params;
   
  const data = await userModel.deleteOne({ email });

  if(!data)
    return res.status(404).send({message: "usuário não encontrado", status: false});

  return res.status(200).send({message: "usuário deletado com sucesso", user: data, status: true});
});

fastify.put("/users/:id", async (req, res) => {
  const id = req.params.id;
  const { name, email, age, contact } = req.body;

  if(!name || !email || !age || !contact)
    return res.status(400).send({
      message: "tosos campos devem ser preenchidos",
      status: false
    });
  
   await userModel.findByIdAndUpdate({ _id: id }, { email, name, age, contact});
   
   return res.status(200).send({
    message: "usuário atualizado com sucesso",
    status: true
   })

});

fastify.patch("/users/:id", async (req, res) => {
  const id = req.params.id;
  const { name , age } = req.body;
  
  if(!name || !age)
    return res.status(400).send({
      message: "Os campos nome e idade são obrigatórios",
      status: false
    });

    await userModel.updateOne({ _id:id }, {name, age});

    res.status(200).send({
      message: "Usuário atualizado com sucesso",
      status: true
    });
});

fastify.post("/users", async (req, res) => {
  const { name, email, age, contact } = req.body;  

  if (!name || !email || !age || !contact) {
    return res.status(400).send({ 
      message: "O preenchimento de todos os campos é obrigatório", 
      status: false 
    });
  }
  
  await userModel.create({ name, email, age, contact });

  return res.status(201).send({
    message: "Usuário criado com sucesso!",
    status: true,
  });
});

fastify.listen({port: 3000}, (err, address) => {
  if(err){
    fastify.log.error(err);
    process.exit(1)
  }
  
  fastify.log.info(`Server listening at ${address}`);
});
