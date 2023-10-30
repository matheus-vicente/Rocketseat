import { Slug } from "./slug";

test("it should be able to create a new slug from a text", () => {
  const slug = Slug.createFromText("Teste de criação de um novo slug 01");

  expect(slug.value).toEqual("teste-de-criacao-de-um-novo-slug-01");
});
