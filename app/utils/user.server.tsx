import bcrypt from 'bcryptjs';
import { prisma } from './prisma.server';

type RegisterFrom = {
    name: string,
    email: string,
    password: string,
}

export const createUser = async( user: RegisterFrom ) => {
    const passwordHash = await bcrypt.hash(user.password, 12);

    const existingUser = await prisma.user.findUnique({
        where: {
            email: user.email,
        },
    });

    if (existingUser) {
        return null;
    }
    const newUser = await prisma.user.create({
        data: {
            name: user.name,
            email: user.email,
            password: passwordHash,
        }
    })
    
    return  { id: newUser.id, email: user.email, name: user.name};
}

type Email = {
    email: string,
}

export const getAllUserEmail = async( user: Email) => {
    try {
        const email = await prisma.user.findMany({
            where: { email: user?.email },
          });
          
          return email;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error; 
    }
}

type UpdatePassFrom = {
    email: string;
    password: string;
};

export const updateUserEmail = async (user: UpdatePassFrom) => {
    try {
      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(user.password, 10);
  
      const updatedUser = await prisma.user.update({
        where: { email: user.email },
        data: {
          password: hashedPassword, // Save the hashed password
        },
      });
  
      return updatedUser;
    } catch (error) {
      console.error("Error updating user password:", error); // Updated the error message
      throw error;
    }
  };


export const getAllUsers = async () => {
    try {
        const users = await prisma.user.findMany();
        
        return users; 
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error; 
    }
};
