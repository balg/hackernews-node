const postedBy = (root, args, context) =>
  context.prisma.link({ id: root.id }).postedBy();

module.exports = {
  postedBy
};
