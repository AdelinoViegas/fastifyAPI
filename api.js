import Fastify from "fastify";
import cors from "@fastify/cors";

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
  return usersData;
});

fastify.get("/users/:id", async (req, res) => {
  const { id } = req.params;
   
  const user = usersData.find( u => u.id === Number(id));

  if(!user) 
    return res.status(404).send({message: "O usuário não foi encontrado", status: false});
  
  return user;
})


fastify.post("/users", async (req, res) => {
  const { name, email } = req.body;  
  console.log(name, email);
  if (!name || !email) {
    return res.status(400).send({ 
      message: "Nome e email são obrigatórios", 
      status: false 
    });
  }

  const newUser = {
    id: usersData.length + 1,
    name,
    email
  };

  usersData.push(newUser);

  return res.status(201).send({
    message: "Usuário criado com sucesso!",
    user: newUser
  });
});

fastify.listen({port: 2026}, (err, address) => {
  if(err){
    fastify.log.error(err);
    process.exit(1)
  }
  
  fastify.log.info(`Server listening at ${address}`);
});
