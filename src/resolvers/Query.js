const info = () => "This is the API of a Hackernews Clone";

const feed = (root, args, context, info) => context.prisma.links();

const link = (root, args, context, info) =>
  context.prisma.link({ id: args.id });

module.exports = {
  info,
  feed,
  link
};
