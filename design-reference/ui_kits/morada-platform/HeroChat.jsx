/* HeroChat — the home-page MIA composer.
 * Gradient avatar (blue→cyan) · auto-grow textarea · primary send button ·
 * suggestion chips. Mirrors the production HeroChat (see
 * poc-redesign-platform/src/components/blocks/home-page.tsx).
 */

function HeroChat({ value, onChange, onSubmit, dark = false }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(Math.max(48, el.scrollHeight), 180) + "px";
  }, [value]);

  const suggestions = [
    "Qual o tempo médio de resposta da minha equipe hoje?",
    "Mostre os leads parados há mais de 48h",
    "Quantos atendimentos perdi na última hora?",
    "Quem está com a maior fila agora?",
  ];

  return (
    <div className="mp-chat">
      <div className="mp-chat__input">
        <div className="mp-chat__avatar">
          <IconSparkles size={22} />
        </div>
        <textarea
          ref={ref}
          className="mp-chat__textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Pergunte à MIA — insights, leads, performance, dados…"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit && onSubmit();
            }
          }}
        />
        <button
          type="button"
          className="mp-chat__send"
          aria-label="Enviar para a MIA"
          onClick={onSubmit}
        >
          <IconArrowUp size={20} />
        </button>
      </div>

      <div className="mp-chat__suggest">
        {suggestions.map((s) => (
          <button key={s} type="button" className="mp-chat__chip" onClick={() => onChange(s)}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

window.HeroChat = HeroChat;
