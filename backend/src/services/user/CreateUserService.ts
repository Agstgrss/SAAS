import prismaClient from "../../prisma";
import { hash } from "bcryptjs";

interface CreateUserProps {
  name: string;
  email: string;
  password: string;
  tenantId: string;
}

class CreateUserService {
  async execute({ name, email, password, tenantId }: CreateUserProps) {
    const UserAlreadyExist=  await prismaClient.user.findFirst({
      where:{
        email: email
      }
    })

    if(UserAlreadyExist){
      throw new Error("Usuário já existente!")
    }

    const passwordHash = await hash(password, 10);

    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        passwordHash,
        tenantId,
      },
      select:{
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
    });

    return user;
  }
}

export { CreateUserService };
