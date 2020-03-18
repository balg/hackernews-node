const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

const signup = async (root, args, context, info) => {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.createUser({
    ...args,
    password
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user
  };
};

const login = async (root, args, context, info) => {
  const user = await context.prisma.user({ email: args.email });
  if (!user) {
    throw new Error("No such user");
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
};

const post = (root, args, context, info) => {
  const userId = getUserId(context);
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } }
  });
};

// TODO
// deleteLink: (root, args) => {
//   const { id } = args;
//   const linkToDelete = links.find(link => link.id === id);
//   if (linkToDelete) {
//     links = links.filter(link => link.id !== linkToDelete.id);
//   }
//   return linkToDelete;
// },

const updateLink = (root, args, context, info) => {
  const userId = getUserId(context);
  const { id, url, description } = args;
  return context.prisma.updateLink(
    { description, url, postedBy: { connect: { id: userId } } },
    { id }
  );
};

module.exports = {
  signup,
  login,
  post,
  updateLink
};
