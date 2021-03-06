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

const deleteLink = (root, args, context, info) => {
  getUserId(context);
  return context.prisma.deleteLink({
    id: args.id
  });
};

const updateLink = (root, args, context, info) => {
  getUserId(context);
  const { id, url, description } = args;
  return context.prisma.updateLink({
    data: {
      description,
      url
    },
    where: {
      id
    }
  });
};

module.exports = {
  signup,
  login,
  post,
  updateLink,
  deleteLink
};
