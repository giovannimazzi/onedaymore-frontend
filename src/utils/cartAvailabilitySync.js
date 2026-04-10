export function mergeAvailabilityIntoCart(prevCart, rows) {
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  return prevCart
    .map((line) => {
      const row = bySlug.get(line.slug);
      if (!row) return line;
      if (!row.found) return null;

      const qa =
        row.quantity_available != null ? Number(row.quantity_available) : null;
      const next = { ...line, quantity_available: qa };

      if (qa != null) {
        next.quantity = Math.min(line.quantity, Math.max(0, qa));
      }

      if (next.quantity <= 0) return null;
      return next;
    })
    .filter(Boolean);
}

export function diffAvailabilityChanges(prevCart, nextCart) {
  const nextBy = new Map(nextCart.map((l) => [l.slug, l]));
  const changes = [];

  for (const line of prevCart) {
    const label = line.name?.trim() || line.slug;
    const nextLine = nextBy.get(line.slug);

    if (!nextLine) {
      changes.push({ kind: "removed", name: label });
      continue;
    }

    const oldQa =
      line.quantity_available != null ? Number(line.quantity_available) : null;
    const newQa =
      nextLine.quantity_available != null
        ? Number(nextLine.quantity_available)
        : null;

    if (nextLine.quantity < line.quantity) {
      changes.push({
        kind: "quantity_reduced",
        name: label,
        oldQty: line.quantity,
        newQty: nextLine.quantity,
        available: newQa,
      });
      continue;
    }

    if (oldQa != null && newQa != null && newQa < oldQa) {
      changes.push({
        kind: "stock_down",
        name: label,
        oldQa,
        newQa,
      });
    }
  }

  return changes;
}

export function buildAvailabilityNotice(changes, cartNowEmpty) {
  if (!changes.length) return null;

  if (cartNowEmpty) {
    return "I prodotti nel carrello non sono più disponibili come richiesto. Il carrello è stato svuotato.";
  }

  if (changes.length === 1) {
    const c = changes[0];
    if (c.kind === "removed") {
      return `"${c.name}" non è più disponibile ed è stato rimosso dal carrello.`;
    }
    if (c.kind === "quantity_reduced") {
      const av =
        c.available != null ? ` Disponibilità attuale: ${c.available}.` : "";
      return `La quantità di "${c.name}" nel carrello è stata ridotta da ${c.oldQty} a ${c.newQty}.${av}`;
    }
    if (c.kind === "stock_down") {
      return `La disponibilità di "${c.name}" è diminuita (ora ${c.newQa} pezzi disponibili).`;
    }
  }

  const removed = changes.filter((x) => x.kind === "removed").length;
  const reduced = changes.filter((x) => x.kind === "quantity_reduced").length;
  const down = changes.filter((x) => x.kind === "stock_down").length;
  const bits = [];
  if (removed) {
    bits.push(
      removed === 1
        ? "un prodotto non è più disponibile"
        : `${removed} prodotti non sono più disponibili`,
    );
  }
  if (reduced) {
    bits.push(
      reduced === 1
        ? "una quantità è stata ridotta"
        : `${reduced} quantità sono state ridotte`,
    );
  }
  if (down) {
    bits.push(
      down === 1
        ? "la disponibilità di un articolo è diminuita"
        : `la disponibilità di ${down} articoli è diminuita`,
    );
  }
  return `Carrello aggiornato: ${bits.join("; ")}. Controlla il riepilogo.`;
}
