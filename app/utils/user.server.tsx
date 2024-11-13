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


export const getAllUsers = async () => {
    try {
        const users = await prisma.user.findMany();
        
        return users; 
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error; 
    }
};
