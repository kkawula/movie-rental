import { Request, Response } from "express-serve-static-core";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { users, User, NewUser } from "../db/schema";

export async function getUsers(req: Request, res: Response) {
  let allUsers: User[] = await db.select().from(users);
  res.send(allUsers);
}

export async function postUser(req: Request, res: Response) {
  const newUser: NewUser = req.body;

  try {
    await db.insert(users).values(newUser);
    res.send("User added");
  } catch (err) {
    res.status(500).send("Error adding user");
  }
}

export async function getUser(req: Request, res: Response) {
  const { id } = req.params;

  let user: User[] = await db
    .select()
    .from(users)
    .where(eq(users.id, Number(id)));

  if (user.length > 0) {
    res.send(user[0]);
  } else {
    res.status(404).send("User not found");
  }
}

export async function updateUser(req: Request, res: Response) {
  const { id } = req.params;
  const updateFields: Partial<NewUser> = req.body;

  try {
    await db
      .update(users)
      .set(updateFields)
      .where(eq(users.id, Number(id)));
    res.send("User updated");
  } catch (err) {
    res.status(500).send("Error updating user");
  }
}

// TODO: Implement deleteUser

// export async function deleteUser(req: Request, res: Response) {
//   const { id } = req.params;

//   try {
//     await db.delete(users).where(eq(users.id, Number(id)));
//     res.send("User deleted");
//   } catch (err) {
//     res.status(500).send("Error deleting user");
//   }
// }
