import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/sobre")({
  component: () => (
    <div>
      <PageHeader title="Sobre o projeto" />
      <div className="container mx-auto max-w-3xl space-y-4 px-4 py-10 text-foreground/90">
        <p>Este sistema foi desenvolvido como evolução de um protótipo para um produto funcional no Lovable. Diferente de um protótipo simples, o produto possui backend, banco de dados, autenticação, persistência de dados, tratamento de erros, validação de entradas e cuidados de segurança.</p>
        <p>O sistema utiliza IA como apoio para sugestões turísticas, mas informa seus limites e recomenda confirmação das informações em fontes oficiais.</p>
        <h2 className="mt-6 text-xl font-semibold">Segurança</h2>
        <ul className="list-disc pl-6">
          <li>Chamada para IA feita exclusivamente no backend (server function).</li>
          <li>Chave da API armazenada em variável de ambiente.</li>
          <li>Validação de entrada no cliente e no servidor (limite de tamanho, anti prompt-injection).</li>
          <li>RLS no banco: cada usuário só vê seus favoritos, roteiros e histórico.</li>
        </ul>
      </div>
    </div>
  ),
});
