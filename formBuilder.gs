// Form builder function that processes the batchUpdate-style JSON
function createFormFromBatchUpdateSpec(spec) {
  const title = spec.title || 'Generated Form';
  const desc  = spec.description || '';
  const requests = Array.isArray(spec.requests) ? [...spec.requests] : [];
  
  if (!requests.length) throw new Error('No requests in spec');

  // Sort by location index to maintain order
  requests.sort((a,b) => (a?.createItem?.location?.index ?? 0) - (b?.createItem?.location?.index ?? 0));

  const form = FormApp.create(title);
  if (desc) form.setDescription(desc);

  requests.forEach(req => {
    const item = req?.createItem?.item || {};

    // Handle page breaks (sections)
    if (item.pageBreakItem) {
      const pb = form.addPageBreakItem().setTitle(item.title || '');
      if (item.description) pb.setHelpText(item.description);
      return;
    }

    // Handle text items
    if (item.textItem) {
      if (item.textItem.paragraph) {
        const p = form.addParagraphTextItem().setTitle(item.title || '');
        if (item.description) p.setHelpText(item.description);
        if (item.required === true) p.setRequired(true);
      } else {
        const t = form.addTextItem().setTitle(item.title || '');
        if (item.description) t.setHelpText(item.description);
        if (item.required === true) t.setRequired(true);
      }
      return;
    }

    // Handle question items
    if (item.questionItem && item.questionItem.question) {
      const q = item.questionItem.question;

      // Scale questions
      if (q.scaleQuestion) {
        const s = q.scaleQuestion;
        const sc = form.addScaleItem().setTitle(item.title || '');
        if (item.description) sc.setHelpText(item.description);
        sc.setBounds(Number(s.low) || 1, Number(s.high) || 5);
        const lowL = s.lowLabel || '';
        const highL = s.highLabel || '';
        if (lowL || highL) sc.setLabels(lowL, highL);
        if (q.required) sc.setRequired(true);
        return;
      }

      // Checkbox questions
      if (q.checkboxQuestion) {
        const c = q.checkboxQuestion;
        const cb = form.addCheckboxItem().setTitle(item.title || '');
        if (item.description) cb.setHelpText(item.description);
        const opts = (c.options || []).map(o => cb.createChoice(o.value || String(o)));
        if (opts.length) cb.setChoices(opts);
        if (q.required) cb.setRequired(true);
        return;
      }

      // Choice questions (radio or dropdown)
      if (q.choiceQuestion) {
        const c = q.choiceQuestion;
        const options = (c.options || []).map(o => o.value || String(o));

        if ((c.type || '').toUpperCase() === 'DROPDOWN') {
          const dd = form.addListItem().setTitle(item.title || '');
          if (item.description) dd.setHelpText(item.description);
          if (options.length) dd.setChoiceValues(options);
          if (q.required) dd.setRequired(true);
          return;
        }

        // Default to RADIO
        const mc = form.addMultipleChoiceItem().setTitle(item.title || '');
        if (item.description) mc.setHelpText(item.description);
        const choices = options.map(v => mc.createChoice(v));
        if (choices.length) mc.setChoices(choices);
        if (q.required) mc.setRequired(true);
        return;
      }

      // Grid questions
      if (q.gridQuestion) {
        const g = q.gridQuestion;
        const grid = form.addGridItem().setTitle(item.title || '');
        if (item.description) grid.setHelpText(item.description);
        if (Array.isArray(g.rows)) grid.setRows(g.rows);
        if (Array.isArray(g.columns)) grid.setColumns(g.columns);
        if (q.required) grid.setRequired(true);
        return;
      }
    }

    // Fallback for unrecognized items
    const fallback = form.addParagraphTextItem().setTitle(item.title || 'Unsupported item');
    if (item.description) fallback.setHelpText(item.description);
    if (item.required === true) fallback.setRequired(true);
  });

  return form.getPublishedUrl();
}