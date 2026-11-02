// "turbo gen component" creates a new component file in packages/ui/src,
// so every component starts with the same simple shape.
module.exports = function generator(plop) {
  plop.setGenerator("component", {
    description: "Add a new component to the shared UI package",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Component name (for example: alert-box)",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/{{kebabCase name}}.tsx",
        templateFile: "templates/component.hbs",
      },
    ],
  });
};
