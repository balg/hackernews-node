const links = (root, args, context, info) =>
  context.prisma.user({ id: root.id }).links();

module.exports = {
  links
};
