import { fetchGetTicketCategoryTree } from '@/service/api';

/**
 * shared ticket-category tree-flattening helper — used by the ticket search/create/edit forms (to pick a
 * category) and the category management page (to pick a parent category). There's no tree-select
 * component in this project, so categories are flattened into an indented option list instead.
 */
export interface TicketCategoryOption extends CommonType.Option<number> {
  category: Api.TicketCategory.TicketCategoryTreeNode;
}

function flattenTree(
  nodes: Api.TicketCategory.TicketCategoryTreeNode[],
  depth: number,
  out: TicketCategoryOption[]
): TicketCategoryOption[] {
  nodes.forEach(node => {
    if (node.status === 1) {
      out.push({ label: `${'　'.repeat(depth)}${node.name}`, value: node.id, category: node });
    }

    if (node.children.length > 0) {
      flattenTree(node.children, depth + 1, out);
    }
  });

  return out;
}

/** only enabled categories, since users must not be able to pick a disabled one */
export async function loadEnabledTicketCategoryOptions(): Promise<TicketCategoryOption[]> {
  const { data, error } = await fetchGetTicketCategoryTree({ status: 1 });

  if (error || !data) {
    return [];
  }

  return flattenTree(data, 0, []);
}
