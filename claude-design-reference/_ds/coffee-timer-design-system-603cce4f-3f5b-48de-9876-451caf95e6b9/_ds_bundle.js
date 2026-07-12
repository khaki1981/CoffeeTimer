/* @ds-bundle: {"format":4,"namespace":"CoffeeTimerDesignSystem_603cce","components":[{"name":"BeanCard","sourcePath":"components/beans/BeanCard.jsx"},{"name":"RadarChart","sourcePath":"components/beans/RadarChart.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Collapsible","sourcePath":"components/core/Collapsible.jsx"},{"name":"ControlButton","sourcePath":"components/core/ControlButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"RatingScale","sourcePath":"components/forms/RatingScale.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Slider","sourcePath":"components/forms/Slider.jsx"},{"name":"Toggle","sourcePath":"components/forms/Toggle.jsx"},{"name":"ProgressSteps","sourcePath":"components/timer/ProgressSteps.jsx"},{"name":"TimerDisplay","sourcePath":"components/timer/TimerDisplay.jsx"}],"sourceHashes":{"components/beans/BeanCard.jsx":"51c9e5df0e2c","components/beans/RadarChart.jsx":"6e2fe94001ca","components/core/Button.jsx":"183ad938050c","components/core/Card.jsx":"30186cbdb49a","components/core/Collapsible.jsx":"59be19c6532f","components/core/ControlButton.jsx":"788560b47036","components/core/Tag.jsx":"d2fde34c525f","components/forms/Input.jsx":"c870e30bce8a","components/forms/RatingScale.jsx":"dc2ecfe77b82","components/forms/Select.jsx":"ab5f49306a29","components/forms/Slider.jsx":"daec95ebd0ff","components/forms/Toggle.jsx":"02ec1dac6717","components/timer/ProgressSteps.jsx":"4542758bb795","components/timer/TimerDisplay.jsx":"66c438871fb1","ui_kits/coffee-timer/BeanMemo.jsx":"69d31956b336","ui_kits/coffee-timer/Panels.jsx":"94c4ba98e16a","ui_kits/coffee-timer/TimerScreen.jsx":"9d7474d1c097"},"inlinedExternals":[],"unexposedExports":[{"name":"inputBoxStyle","sourcePath":"components/forms/Input.jsx"},{"name":"inputFieldWrap","sourcePath":"components/forms/Input.jsx"},{"name":"inputLabelStyle","sourcePath":"components/forms/Input.jsx"}]} */

(() => {

const __ds_ns = (window.CoffeeTimerDesignSystem_603cce = window.CoffeeTimerDesignSystem_603cce || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/beans/RadarChart.jsx
try { (() => {
const AXES = ["酸味", "苦味", "甘み", "コク", "香り", "後味", "飲みやすさ"];

/**
 * Taste radar chart — 7 axes, 1–5 scale. Light greige grid, wood fill.
 */
function RadarChart({
  values = [3, 3, 3, 3, 3, 3, 3],
  labels = AXES,
  size = 220,
  max = 5
}) {
  const cx = 90,
    cy = 92,
    r = 62;
  const n = labels.length;
  const pt = (i, v) => {
    const a = Math.PI * 2 * i / n - Math.PI / 2;
    return [cx + Math.cos(a) * r * (v / max), cy + Math.sin(a) * r * (v / max)];
  };
  const ring = v => labels.map((_, i) => pt(i, v).join(",")).join(" ");
  const shape = labels.map((_, i) => pt(i, values[i] ?? 0).join(",")).join(" ");
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 180 184",
    width: size,
    height: size * (184 / 180),
    role: "img",
    "aria-label": "\u5473\u306E\u8A55\u4FA1\u30EC\u30FC\u30C0\u30FC\u30C1\u30E3\u30FC\u30C8",
    style: {
      overflow: "visible",
      display: "block"
    }
  }, [1, 2, 3, 4, 5].map(v => /*#__PURE__*/React.createElement("polygon", {
    key: v,
    points: ring(v),
    fill: "none",
    stroke: v === max ? "var(--border-strong)" : "var(--border-line)",
    strokeWidth: "1"
  })), labels.map((_, i) => {
    const [x, y] = pt(i, max);
    return /*#__PURE__*/React.createElement("line", {
      key: i,
      x1: cx,
      y1: cy,
      x2: x,
      y2: y,
      stroke: "var(--border-line)",
      strokeWidth: "1"
    });
  }), /*#__PURE__*/React.createElement("polygon", {
    points: shape,
    fill: "rgba(201, 154, 104, 0.30)",
    stroke: "var(--wood-600)",
    strokeWidth: "1.75",
    strokeLinejoin: "round"
  }), labels.map((_, i) => {
    const [x, y] = pt(i, values[i] ?? 0);
    return /*#__PURE__*/React.createElement("circle", {
      key: i,
      cx: x,
      cy: y,
      r: "2.6",
      fill: "var(--paper)",
      stroke: "var(--wood-600)",
      strokeWidth: "1.5"
    });
  }), labels.map((l, i) => {
    const [x, y] = pt(i, max * 1.24);
    return /*#__PURE__*/React.createElement("text", {
      key: l,
      x: x,
      y: y + 2.5,
      textAnchor: "middle",
      style: {
        fill: "var(--text-muted)",
        fontSize: 8.5,
        fontFamily: "var(--font-jp)",
        fontWeight: 500
      }
    }, l);
  }));
}
Object.assign(__ds_scope, { RadarChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/beans/RadarChart.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const V = {
  primary: {
    background: "var(--wood-600)",
    color: "var(--text-on-brown)",
    border: "1.5px solid var(--wood-600)",
    boxShadow: "var(--shadow-button)"
  },
  secondary: {
    background: "var(--paper)",
    color: "var(--wood-600)",
    border: "1.5px solid var(--wood-600)",
    boxShadow: "none"
  },
  ghost: {
    background: "var(--greige)",
    color: "var(--text-body)",
    border: "1px solid var(--border-line)",
    boxShadow: "none"
  },
  text: {
    background: "transparent",
    color: "var(--wood-600)",
    border: "1px solid transparent",
    boxShadow: "none"
  },
  danger: {
    background: "var(--terracotta-soft)",
    color: "var(--terracotta)",
    border: "1px solid var(--terracotta)",
    boxShadow: "none"
  }
};
const S = {
  sm: {
    minHeight: 36,
    padding: "0 14px",
    fontSize: 13,
    borderRadius: "var(--radius-sm)"
  },
  md: {
    minHeight: 44,
    padding: "0 18px",
    fontSize: 15,
    borderRadius: "var(--radius-md)"
  },
  lg: {
    minHeight: 52,
    padding: "0 24px",
    fontSize: 16,
    borderRadius: "var(--radius-md)"
  }
};
function Button({
  variant = "primary",
  size = "md",
  full = false,
  disabled = false,
  children,
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const v = V[variant] || V.primary;
  const hoverBg = {
    primary: "#5A3E2D",
    secondary: "var(--wood-soft)",
    ghost: "#E3DED2",
    text: "var(--wood-soft)",
    danger: "#EFD6C9"
  }[variant] || v.background;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      fontFamily: "var(--font-jp)",
      fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      width: full ? "100%" : undefined,
      opacity: disabled ? 0.45 : 1,
      transition: "background-color var(--dur-fast) ease, transform var(--dur-fast) ease",
      transform: press ? "translateY(1px)" : "none",
      ...v,
      ...S[size],
      background: hover && !disabled ? hoverBg : v.background,
      boxShadow: press ? "none" : v.boxShadow,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
/** White surface card — the basic container of every screen. */
function Card({
  title,
  action,
  well = false,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: well ? "var(--greige)" : "var(--surface-card)",
      border: "1px solid var(--border-line)",
      borderRadius: "var(--radius-lg)",
      boxShadow: well ? "var(--shadow-inset-well)" : "var(--shadow-card)",
      padding: "var(--card-pad)",
      display: "grid",
      gap: 14,
      ...style
    }
  }, (title || action) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12
    }
  }, title ? /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "var(--text-h2)",
      margin: 0
    }
  }, title) : /*#__PURE__*/React.createElement("span", null), action), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Collapsible.jsx
try { (() => {
/** Collapsible section (details/summary pattern from the app: 詳細情報 / 評価を編集 / メモ). */
function Collapsible({
  label,
  defaultOpen = false,
  children
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-expanded": open,
    onClick: () => setOpen(!open),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: "100%",
      minHeight: 44,
      padding: "10px 14px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      background: open ? "var(--wood-soft)" : hover ? "var(--greige)" : "var(--paper)",
      border: "1px solid var(--border-line)",
      borderRadius: "var(--radius-md)",
      fontFamily: "var(--font-jp)",
      fontSize: 14,
      fontWeight: 700,
      color: "var(--wood-600)",
      transition: "background-color var(--dur-fast) ease"
    }
  }, label, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    style: {
      transform: open ? "rotate(180deg)" : "none",
      transition: "transform var(--dur-med) var(--ease-out)",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }))), open && /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 12,
      display: "grid",
      gap: "var(--field-gap)"
    }
  }, children));
}
Object.assign(__ds_scope, { Collapsible });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Collapsible.jsx", error: String((e && e.message) || e) }); }

// components/core/ControlButton.jsx
try { (() => {
/** Round timer operation button (▶ ⏸ ■ ♪). 64px hit target. */
function ControlButton({
  icon = "play",
  primary = false,
  active = false,
  label,
  onClick,
  size = 64
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const filled = primary || active;
  const paths = {
    play: /*#__PURE__*/React.createElement("polygon", {
      points: "6 3 20 12 6 21 6 3",
      fill: "currentColor",
      stroke: "none"
    }),
    pause: /*#__PURE__*/React.createElement("g", {
      fill: "currentColor",
      stroke: "none"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "6",
      y: "4",
      width: "4",
      height: "16",
      rx: "1"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "14",
      y: "4",
      width: "4",
      height: "16",
      rx: "1"
    })),
    stop: /*#__PURE__*/React.createElement("rect", {
      x: "5",
      y: "5",
      width: "14",
      height: "14",
      rx: "2",
      fill: "currentColor",
      stroke: "none"
    }),
    music: /*#__PURE__*/React.createElement("g", {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.75",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9 18V5l12-2v13"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "6",
      cy: "18",
      r: "3"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "18",
      cy: "16",
      r: "3"
    })),
    plus: /*#__PURE__*/React.createElement("g", {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.75",
      strokeLinecap: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 5v14"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 12h14"
    }))
  };
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": label,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      width: size,
      height: size,
      borderRadius: "50%",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      border: filled ? "1.5px solid var(--wood-600)" : "1.5px solid var(--border-strong)",
      background: filled ? hover ? "#5A3E2D" : "var(--wood-600)" : hover ? "var(--wood-soft)" : "var(--paper)",
      color: filled ? "var(--text-on-brown)" : "var(--wood-600)",
      boxShadow: press ? "none" : "var(--shadow-button)",
      transform: press ? "translateY(1px)" : "none",
      transition: "background-color var(--dur-fast) ease, transform var(--dur-fast) ease"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size * 0.36,
    height: size * 0.36,
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, paths[icon] || paths.play));
}
Object.assign(__ds_scope, { ControlButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ControlButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
/** Flavor-note chip. Tones: default (wood tint), sage, bluegray, terracotta, empty (dashed placeholder). */
function Tag({
  tone = "wood",
  children
}) {
  const tones = {
    wood: {
      background: "var(--wood-soft)",
      border: "1px solid #DCC9B0",
      color: "var(--wood-600)"
    },
    sage: {
      background: "var(--sage-soft)",
      border: "1px solid #C4D0C2",
      color: "#5A7360"
    },
    bluegray: {
      background: "var(--bluegray-soft)",
      border: "1px solid #C7D2D9",
      color: "#5F7683"
    },
    terracotta: {
      background: "var(--terracotta-soft)",
      border: "1px solid #E2C0AC",
      color: "#A85F41"
    },
    empty: {
      background: "transparent",
      border: "1px dashed var(--border-strong)",
      color: "var(--text-muted)"
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "4px 12px",
      borderRadius: "var(--radius-pill)",
      fontSize: 12.5,
      fontWeight: 500,
      lineHeight: 1.5,
      ...(tones[tone] || tones.wood)
    }
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/beans/BeanCard.jsx
try { (() => {
/**
 * Bean memo list card: name, favorite star, meta line, overall score, flavor tags, edit/delete.
 */
function BeanCard({
  name = "豆の名前",
  roaster,
  meta,
  overall = 3,
  favorite = false,
  flavors = [],
  onEdit,
  onDelete,
  onToggleFavorite
}) {
  return /*#__PURE__*/React.createElement("article", {
    style: {
      display: "grid",
      gap: 10,
      padding: 16,
      background: "var(--surface-card)",
      border: "1px solid var(--border-line)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-card)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 2,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15.5,
      fontWeight: 700,
      color: "var(--text-body)",
      lineHeight: 1.4
    }
  }, name), (roaster || meta) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--text-muted)",
      lineHeight: 1.5
    }
  }, [roaster, meta].filter(Boolean).join(" · "))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "\u304A\u6C17\u306B\u5165\u308A",
    "aria-pressed": favorite,
    onClick: onToggleFavorite,
    style: {
      background: "none",
      border: "none",
      padding: 4,
      cursor: "pointer",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: favorite ? "var(--terracotta)" : "none",
    stroke: favorite ? "var(--terracotta)" : "var(--border-strong)",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"
  }))), /*#__PURE__*/React.createElement("span", {
    "aria-label": `総合評価 ${overall}`,
    style: {
      display: "grid",
      placeItems: "center",
      width: 34,
      height: 34,
      borderRadius: "50%",
      background: "var(--wood-soft)",
      border: "1.5px solid var(--wood-300)",
      fontFamily: "var(--font-num)",
      fontWeight: 700,
      fontSize: 15,
      color: "var(--wood-600)"
    }
  }, overall))), flavors.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6
    }
  }, flavors.map(f => /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    key: f
  }, f))), (onEdit || onDelete) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }
  }, onEdit && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: "sm",
    onClick: onEdit
  }, "\u7DE8\u96C6"), onDelete && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "danger",
    size: "sm",
    onClick: onDelete
  }, "\u524A\u9664")));
}
Object.assign(__ds_scope, { BeanCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/beans/BeanCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const fieldWrap = {
  display: "grid",
  gap: 6
};
const labelStyle = {
  fontSize: "var(--text-label)",
  fontWeight: 500,
  color: "var(--text-muted)",
  letterSpacing: "0.01em"
};
const boxStyle = focus => ({
  width: "100%",
  minWidth: 0,
  minHeight: 44,
  padding: "10px 14px",
  fontFamily: "var(--font-jp)",
  fontSize: 15,
  color: "var(--text-body)",
  background: "var(--paper)",
  border: focus ? "1.5px solid var(--wood-600)" : "1.5px solid var(--border-strong)",
  borderRadius: "var(--radius-sm)",
  outline: "none",
  boxShadow: focus ? "0 0 0 3px rgba(107,74,54,0.10)" : "none",
  transition: "border-color var(--dur-fast) ease, box-shadow var(--dur-fast) ease",
  boxSizing: "border-box"
});

/** Labeled text input / textarea. */
function Input({
  label,
  type = "text",
  multiline = false,
  rows = 3,
  placeholder,
  value,
  onChange,
  unit
}) {
  const [focus, setFocus] = React.useState(false);
  const common = {
    placeholder,
    value,
    onChange: onChange ? e => onChange(e.target.value) : undefined,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      ...boxStyle(focus),
      resize: multiline ? "vertical" : undefined
    }
  };
  return /*#__PURE__*/React.createElement("label", {
    style: fieldWrap
  }, label && /*#__PURE__*/React.createElement("span", {
    style: labelStyle
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, multiline ? /*#__PURE__*/React.createElement("textarea", _extends({
    rows: rows
  }, common)) : /*#__PURE__*/React.createElement("input", _extends({
    type: type
  }, common)), unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--text-muted)",
      flex: "none"
    }
  }, unit)));
}
const inputFieldWrap = fieldWrap;
const inputLabelStyle = labelStyle;
const inputBoxStyle = boxStyle;
Object.assign(__ds_scope, { Input, inputFieldWrap, inputLabelStyle, inputBoxStyle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/RatingScale.jsx
try { (() => {
/** 1–5 rating button row for taste axes (酸味, 苦味, 甘み …). */
function RatingScale({
  label,
  value = 3,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "76px minmax(0,1fr)",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: "var(--text-muted)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(5, minmax(0,1fr))",
      gap: 6
    }
  }, [1, 2, 3, 4, 5].map(n => {
    const active = n === value;
    return /*#__PURE__*/React.createElement("button", {
      key: n,
      type: "button",
      "aria-pressed": active,
      onClick: onChange ? () => onChange(n) : undefined,
      style: {
        minHeight: 38,
        padding: 0,
        cursor: "pointer",
        fontFamily: "var(--font-num)",
        fontSize: 14,
        fontWeight: active ? 700 : 400,
        background: active ? "var(--wood-600)" : "var(--paper)",
        color: active ? "var(--text-on-brown)" : "var(--text-muted)",
        border: active ? "1.5px solid var(--wood-600)" : "1.5px solid var(--border-strong)",
        borderRadius: "var(--radius-sm)",
        transition: "background-color var(--dur-fast) ease"
      }
    }, n);
  })));
}
Object.assign(__ds_scope, { RatingScale });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/RatingScale.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
/** Labeled select with custom chevron (抽出メニュー, 焙煎度, 精製方法 …). */
function Select({
  label,
  options = [],
  value,
  onChange
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: __ds_scope.inputFieldWrap
  }, label && /*#__PURE__*/React.createElement("span", {
    style: __ds_scope.inputLabelStyle
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: value,
    onChange: onChange ? e => onChange(e.target.value) : undefined,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      ...__ds_scope.inputBoxStyle(focus),
      appearance: "none",
      paddingRight: 40,
      cursor: "pointer"
    }
  }, options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o))), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--wood-400)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    style: {
      position: "absolute",
      right: 14,
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Slider.jsx
try { (() => {
/** Volume slider with numeric readout (音量 rows in 音設定). */
function Slider({
  label,
  value = 50,
  min = 0,
  max = 100,
  onChange
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "grid",
      gridTemplateColumns: "76px minmax(0,1fr) 36px",
      alignItems: "center",
      gap: 10,
      fontSize: 13,
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: min,
    max: max,
    value: value,
    onChange: onChange ? e => onChange(Number(e.target.value)) : undefined,
    style: {
      width: "100%",
      height: 34,
      margin: 0,
      accentColor: "var(--wood-600)",
      cursor: "pointer",
      touchAction: "pan-y"
    }
  }), /*#__PURE__*/React.createElement("output", {
    style: {
      fontSize: 13,
      color: "var(--text-body)",
      fontFamily: "var(--font-num)",
      fontVariantNumeric: "tabular-nums",
      textAlign: "right"
    }
  }, value));
}
Object.assign(__ds_scope, { Slider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Slider.jsx", error: String((e && e.message) || e) }); }

// components/forms/Toggle.jsx
try { (() => {
/** ON/OFF toggle switch with text state label (通知音, BGM). */
function Toggle({
  label,
  checked = false,
  onChange,
  showState = true
}) {
  const w = 46,
    h = 26,
    knob = 18;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      cursor: "pointer",
      fontSize: 14,
      color: "var(--text-body)"
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 64
    }
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    onChange: onChange ? e => onChange(e.target.checked) : undefined,
    style: {
      position: "absolute",
      width: 1,
      height: 1,
      opacity: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: "relative",
      flex: "none",
      width: w,
      height: h,
      borderRadius: "var(--radius-pill)",
      background: checked ? "var(--sage)" : "var(--greige)",
      border: checked ? "1.5px solid var(--sage)" : "1.5px solid var(--border-strong)",
      transition: "background-color var(--dur-fast) ease"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: (h - knob) / 2 - 1.5,
      left: 3,
      width: knob,
      height: knob,
      borderRadius: "50%",
      background: "var(--paper)",
      boxShadow: "0 1px 2px rgba(63,48,40,0.2)",
      transform: checked ? `translateX(${w - knob - 9}px)` : "none",
      transition: "transform var(--dur-med) var(--ease-out)"
    }
  })), showState && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      minWidth: 28,
      color: checked ? "var(--sage)" : "var(--text-muted)",
      fontWeight: 700,
      fontFamily: "var(--font-num)"
    }
  }, checked ? "ON" : "OFF"));
}
Object.assign(__ds_scope, { Toggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Toggle.jsx", error: String((e && e.message) || e) }); }

// components/timer/ProgressSteps.jsx
try { (() => {
/**
 * Brewing progress: step chips (蒸らし → 1投目 → …) + sage progress bar.
 * done = sage, current = brown, upcoming = greige.
 */
function ProgressSteps({
  steps = [],
  current = 0,
  percent
}) {
  const pct = percent ?? (steps.length ? Math.round(current / steps.length * 100) : 0);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, steps.map((s, i) => {
    const state = i < current ? "done" : i === current ? "current" : "next";
    const styles = {
      done: {
        background: "var(--sage-soft)",
        color: "#5A7360",
        border: "1px solid #C4D0C2"
      },
      current: {
        background: "var(--wood-600)",
        color: "var(--text-on-brown)",
        border: "1px solid var(--wood-600)",
        fontWeight: 700
      },
      next: {
        background: "var(--greige)",
        color: "var(--text-muted)",
        border: "1px solid var(--border-line)"
      }
    }[state];
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 12px",
        borderRadius: "var(--radius-pill)",
        fontSize: 12.5,
        ...styles
      }
    }, state === "done" && /*#__PURE__*/React.createElement("svg", {
      width: "11",
      height: "11",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "3",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M20 6 9 17l-5-5"
    })), s);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      borderRadius: "var(--radius-pill)",
      background: "var(--greige)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${pct}%`,
      background: "var(--sage)",
      borderRadius: "var(--radius-pill)",
      transition: "width var(--dur-med) var(--ease-out)"
    }
  })));
}
Object.assign(__ds_scope, { ProgressSteps });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/timer/ProgressSteps.jsx", error: String((e && e.message) || e) }); }

// components/timer/TimerDisplay.jsx
try { (() => {
/**
 * Big timer readout: current step, mm:ss digits, status line.
 * The heart of the app — digits large, tabular, Outfit.
 */
function TimerDisplay({
  time = "01:00",
  step = "蒸らし",
  status = "準備完了",
  running = false,
  compact = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 4,
      justifyItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontSize: 13.5,
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      flex: "none",
      background: running ? "var(--sage)" : "var(--border-strong)"
    }
  }), "\u73FE\u5728\uFF1A", step), /*#__PURE__*/React.createElement("time", {
    style: {
      fontFamily: "var(--font-num)",
      fontVariantNumeric: "tabular-nums",
      fontSize: compact ? "var(--text-timer-sub)" : "var(--text-timer)",
      fontWeight: 600,
      lineHeight: 1.05,
      letterSpacing: "-0.02em",
      color: "var(--wood-700)"
    }
  }, time), status && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: running ? "var(--sage)" : "var(--text-muted)",
      letterSpacing: "0.04em",
      minHeight: "1.4em"
    }
  }, status));
}
Object.assign(__ds_scope, { TimerDisplay });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/timer/TimerDisplay.jsx", error: String((e && e.message) || e) }); }

// ui_kits/coffee-timer/BeanMemo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Coffee Timer UI kit — bean memo panel (form + list)
const {
  Button,
  Card,
  Tag,
  Collapsible,
  Input,
  Select,
  RatingScale,
  BeanCard,
  RadarChart
} = window.CoffeeTimerDesignSystem_603cce;
const AXIS_KEYS = ["酸味", "苦味", "甘み", "コク", "香り", "後味", "飲みやすさ"];
function BeanMemo({
  onClose
}) {
  const [ratings, setRatings] = React.useState([4, 2, 4, 3, 5, 4, 4]);
  const [overall, setOverall] = React.useState(4);
  const [beans, setBeans] = React.useState([{
    name: "エチオピア イルガチェフェ",
    roaster: "○○ Coffee",
    meta: "エチオピア · ウォッシュド · 中浅煎り",
    overall: 4,
    favorite: true,
    flavors: ["柑橘", "花", "紅茶"]
  }, {
    name: "ブラジル No.2",
    roaster: "KALDI",
    meta: "ブラジル · ナチュラル · 中深煎り",
    overall: 3,
    favorite: false,
    flavors: ["チョコレート", "ナッツ"]
  }]);
  const [saved, setSaved] = React.useState(false);
  return /*#__PURE__*/React.createElement(Card, {
    title: "Coffee Bean Memo",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "text",
      size: "sm",
      onClick: onClose
    }, "\u9589\u3058\u308B")
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "-6px 0 0",
      fontSize: 12.5,
      color: "var(--text-muted)"
    }
  }, "\u65B0\u3057\u3044\u8C46\u30E1\u30E2"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--field-gap)"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "\u8C46\u306E\u540D\u524D",
    placeholder: "\u30A8\u30C1\u30AA\u30D4\u30A2 \u30A4\u30EB\u30AC\u30C1\u30A7\u30D5\u30A7"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "\u30ED\u30FC\u30B9\u30BF\u30FC / \u8CFC\u5165\u5E97",
    placeholder: "\u25CB\u25CB Coffee"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "\u7523\u5730",
    options: ["エチオピア", "ブラジル", "コロンビア", "グアテマラ", "ケニア", "インドネシア", "その他"]
  }), /*#__PURE__*/React.createElement(Select, {
    label: "\u7CBE\u88FD\u65B9\u6CD5",
    options: ["ウォッシュド", "ナチュラル", "ハニー", "アナエロビック", "その他"]
  })), /*#__PURE__*/React.createElement(Select, {
    label: "\u7119\u714E\u5EA6",
    options: ["浅煎り", "中浅煎り", "中煎り", "中深煎り", "深煎り"]
  })), /*#__PURE__*/React.createElement(Collapsible, {
    label: "\u8A73\u7D30\u60C5\u5831"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "\u8CFC\u5165\u65E5",
    type: "date"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "\u958B\u5C01\u65E5",
    type: "date"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "\u8CFC\u5165\u4FA1\u683C",
    type: "number",
    unit: "\u5186"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "\u5185\u5BB9\u91CF",
    type: "number",
    unit: "g"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 12,
      borderTop: "1px solid var(--border-line)",
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: "var(--text-h3)",
      fontWeight: 700
    }
  }, "\u5473\u306E\u8A55\u4FA1"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontSize: 12.5,
      color: "var(--text-muted)"
    }
  }, "\u7DCF\u5408\u8A55\u4FA1", /*#__PURE__*/React.createElement("span", {
    style: {
      display: "grid",
      placeItems: "center",
      width: 30,
      height: 30,
      borderRadius: "50%",
      background: "var(--wood-soft)",
      border: "1.5px solid var(--wood-300)",
      fontFamily: "var(--font-num)",
      fontWeight: 700,
      color: "var(--wood-600)"
    }
  }, overall))), /*#__PURE__*/React.createElement("div", {
    style: {
      justifySelf: "center"
    }
  }, /*#__PURE__*/React.createElement(RadarChart, {
    values: ratings,
    size: 230
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 7,
      fontSize: 12.5,
      color: "var(--text-muted)"
    }
  }, "\u30D5\u30EC\u30FC\u30D0\u30FC\u30CE\u30FC\u30C8", /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Tag, null, "\u67D1\u6A58"), /*#__PURE__*/React.createElement(Tag, null, "\u82B1"), /*#__PURE__*/React.createElement(Tag, null, "\u7D05\u8336"))), /*#__PURE__*/React.createElement(Collapsible, {
    label: "\u8A55\u4FA1\u3092\u7DE8\u96C6"
  }, AXIS_KEYS.map((k, i) => /*#__PURE__*/React.createElement(RatingScale, {
    key: k,
    label: k,
    value: ratings[i],
    onChange: v => setRatings(ratings.map((x, j) => j === i ? v : x))
  })), /*#__PURE__*/React.createElement(RatingScale, {
    label: "\u7DCF\u5408\u8A55\u4FA1",
    value: overall,
    onChange: setOverall
  }), /*#__PURE__*/React.createElement(Input, {
    label: "\u30D5\u30EC\u30FC\u30D0\u30FC\u30CE\u30FC\u30C8",
    placeholder: "\u67D1\u6A58, \u82B1, \u7D05\u8336"
  }))), /*#__PURE__*/React.createElement(Collapsible, {
    label: "\u30E1\u30E2"
  }, /*#__PURE__*/React.createElement(Input, {
    label: "\u611F\u60F3\u30E1\u30E2",
    multiline: true,
    placeholder: "\u7518\u307F\u304C\u5F37\u304B\u3063\u305F\u3002\u51B7\u3081\u308B\u3068\u67D1\u6A58\u611F\u304C\u51FA\u305F\u3002"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "\u6B21\u56DE\u8A66\u3057\u305F\u3044\u3053\u3068",
    multiline: true,
    placeholder: "\u7C97\u633D\u304D\u306B\u3059\u308B\u3002\u6E6F\u6E29\u309288\u2103\u306B\u3059\u308B\u3002"
  }), /*#__PURE__*/React.createElement(Select, {
    label: "\u30EA\u30D4\u30FC\u30C8\u8A55\u4FA1",
    options: ["5 また買いたい", "4", "3", "2", "1"]
  })), /*#__PURE__*/React.createElement(Button, {
    full: true,
    onClick: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    }
  }, "\u4FDD\u5B58"), saved && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      textAlign: "center",
      fontSize: 13,
      color: "var(--sage)"
    }
  }, "\u8C46\u30E1\u30E2\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 12,
      borderTop: "1px solid var(--border-line)",
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: "var(--text-h3)",
      fontWeight: 700
    }
  }, "\u8C46\u30E1\u30E2\u4E00\u89A7"), beans.map((b, i) => /*#__PURE__*/React.createElement(BeanCard, _extends({
    key: b.name
  }, b, {
    onEdit: () => {},
    onDelete: () => setBeans(beans.filter((_, j) => j !== i)),
    onToggleFavorite: () => setBeans(beans.map((x, j) => j === i ? {
      ...x,
      favorite: !x.favorite
    } : x))
  })))));
}
window.KitBeanMemo = BeanMemo;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/coffee-timer/BeanMemo.jsx", error: String((e && e.message) || e) }); }

// ui_kits/coffee-timer/Panels.jsx
try { (() => {
// Coffee Timer UI kit — sound settings + menu editor panels
const {
  Button,
  Card,
  Input,
  Select,
  Toggle,
  Slider
} = window.CoffeeTimerDesignSystem_603cce;
function SoundSettings({
  onClose
}) {
  const [alertOn, setAlertOn] = React.useState(true);
  const [alertVol, setAlertVol] = React.useState(91);
  const [bgmOn, setBgmOn] = React.useState(false);
  const [bgmVol, setBgmVol] = React.useState(59);
  return /*#__PURE__*/React.createElement(Card, {
    title: "\u97F3\u8A2D\u5B9A",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "text",
      size: "sm",
      onClick: onClose
    }, "\u9589\u3058\u308B")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: "var(--text-h3)",
      color: "var(--text-muted)",
      fontWeight: 700
    }
  }, "\u901A\u77E5\u97F3"), /*#__PURE__*/React.createElement(Toggle, {
    label: "\u901A\u77E5\u97F3",
    checked: alertOn,
    onChange: setAlertOn
  }), /*#__PURE__*/React.createElement(Select, {
    label: "\u7A2E\u985E",
    options: ["Bell", "Wood", "Soft"]
  }), /*#__PURE__*/React.createElement(Slider, {
    label: "\u97F3\u91CF",
    value: alertVol,
    onChange: setAlertVol
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 12,
      borderTop: "1px solid var(--border-line)",
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: "var(--text-h3)",
      color: "var(--text-muted)",
      fontWeight: 700
    }
  }, "\u66F2"), /*#__PURE__*/React.createElement(Toggle, {
    label: "BGM",
    checked: bgmOn,
    onChange: setBgmOn
  }), /*#__PURE__*/React.createElement(Select, {
    label: "\u66F2\u9078\u629E",
    options: ["None", "Morning Coffee", "Cafe Jazz", "Rain", "Lo-Fi"]
  }), /*#__PURE__*/React.createElement(Slider, {
    label: "\u97F3\u91CF",
    value: bgmVol,
    onChange: setBgmVol
  })));
}
function MenuEditor({
  onClose
}) {
  const [steps, setSteps] = React.useState(window.KIT_STEPS.map(s => ({
    ...s
  })));
  const [saved, setSaved] = React.useState(false);
  return /*#__PURE__*/React.createElement(Card, {
    title: "\u30E1\u30CB\u30E5\u30FC\u7DE8\u96C6",
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "text",
      size: "sm"
    }, "\u65B0\u898F\u30E1\u30CB\u30E5\u30FC")
  }, /*#__PURE__*/React.createElement(Input, {
    label: "\u30E1\u30CB\u30E5\u30FC\u540D",
    value: "\u30CF\u30F3\u30C9\u30C9\u30EA\u30C3\u30D7\u57FA\u672C",
    onChange: () => {}
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 10
    }
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "grid",
      gridTemplateColumns: "minmax(0,1fr) 90px auto",
      gap: 8,
      alignItems: "end",
      paddingBottom: 10,
      borderBottom: "1px solid var(--border-line)"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: i === 0 ? "工程" : undefined,
    value: s.name,
    onChange: v => setSteps(steps.map((x, j) => j === i ? {
      ...x,
      name: v
    } : x))
  }), /*#__PURE__*/React.createElement(Input, {
    label: i === 0 ? "秒数" : undefined,
    type: "number",
    unit: "\u79D2",
    value: String(s.sec),
    onChange: v => setSteps(steps.map((x, j) => j === i ? {
      ...x,
      sec: Number(v) || 0
    } : x))
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    size: "sm",
    disabled: steps.length <= 1,
    onClick: () => setSteps(steps.filter((_, j) => j !== i))
  }, "\u524A\u9664")))), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    full: true,
    onClick: () => setSteps([...steps, {
      name: `${steps.length}投目`,
      sec: 30
    }])
  }, "\uFF0B \u5DE5\u7A0B\u3092\u8FFD\u52A0"), /*#__PURE__*/React.createElement(Button, {
    full: true,
    onClick: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    }
  }, "\u8A18\u9332"), saved && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      textAlign: "center",
      fontSize: 13,
      color: "var(--sage)"
    }
  }, "\u30E1\u30CB\u30E5\u30FC\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F"), /*#__PURE__*/React.createElement(Button, {
    variant: "text",
    size: "sm",
    onClick: onClose,
    style: {
      justifySelf: "center"
    }
  }, "\u9589\u3058\u308B"));
}
window.KitSoundSettings = SoundSettings;
window.KitMenuEditor = MenuEditor;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/coffee-timer/Panels.jsx", error: String((e && e.message) || e) }); }

// ui_kits/coffee-timer/TimerScreen.jsx
try { (() => {
// Coffee Timer UI kit — main timer screen
const {
  Button,
  ControlButton,
  Card,
  Tag,
  Collapsible,
  Input,
  Select,
  Toggle,
  Slider,
  RatingScale,
  TimerDisplay,
  ProgressSteps,
  BeanCard,
  RadarChart
} = window.CoffeeTimerDesignSystem_603cce;
const KIT_STEPS = [{
  name: "蒸らし",
  sec: 30
}, {
  name: "1投目",
  sec: 60
}, {
  name: "2投目",
  sec: 45
}, {
  name: "3投目",
  sec: 40
}];
function fmt(s) {
  const m = String(Math.floor(s / 60)).padStart(2, "0");
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}
function TimerScreen({
  openPanel,
  setOpenPanel
}) {
  const [stepIdx, setStepIdx] = React.useState(0);
  const [left, setLeft] = React.useState(KIT_STEPS[0].sec);
  const [running, setRunning] = React.useState(false);
  const total = KIT_STEPS.reduce((a, s) => a + s.sec, 0);
  const elapsed = KIT_STEPS.slice(0, stepIdx).reduce((a, s) => a + s.sec, 0) + (KIT_STEPS[stepIdx].sec - left);
  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setLeft(v => {
        if (v > 1) return v - 1;
        setStepIdx(i => {
          if (i + 1 < KIT_STEPS.length) {
            setLeft(KIT_STEPS[i + 1].sec);
            return i + 1;
          }
          setRunning(false);
          setLeft(0);
          return i;
        });
        return v;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running]);
  const reset = () => {
    setRunning(false);
    setStepIdx(0);
    setLeft(KIT_STEPS[0].sec);
  };
  return /*#__PURE__*/React.createElement(Card, {
    style: {
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(TimerDisplay, {
    time: fmt(left),
    step: KIT_STEPS[stepIdx].name,
    status: running ? "抽出中" : elapsed > 0 ? "一時停止中" : "準備完了",
    running: running
  }), /*#__PURE__*/React.createElement(ProgressSteps, {
    steps: KIT_STEPS.map(s => s.name),
    current: stepIdx,
    percent: Math.round(elapsed / total * 100)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(ControlButton, {
    icon: running ? "pause" : "play",
    primary: true,
    label: running ? "一時停止" : "開始",
    onClick: () => setRunning(!running)
  }), /*#__PURE__*/React.createElement(ControlButton, {
    icon: "stop",
    label: "\u30EA\u30BB\u30C3\u30C8",
    onClick: reset
  }), /*#__PURE__*/React.createElement(ControlButton, {
    icon: "music",
    active: openPanel === "sound",
    label: "\u97F3\u8A2D\u5B9A",
    onClick: () => setOpenPanel(openPanel === "sound" ? null : "sound")
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "minmax(0,1fr) auto",
      gap: 8,
      alignItems: "end"
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "\u62BD\u51FA\u30E1\u30CB\u30E5\u30FC",
    options: ["ハンドドリップ基本", "深煎り向けゆっくり", "アイスコーヒー"]
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => setOpenPanel(openPanel === "editor" ? null : "editor")
  }, "\u7DE8\u96C6")), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    full: true,
    onClick: () => setOpenPanel(openPanel === "beans" ? null : "beans")
  }, "\u2615 \u8C46\u30E1\u30E2"));
}
window.KitTimerScreen = TimerScreen;
window.KIT_STEPS = KIT_STEPS;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/coffee-timer/TimerScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.BeanCard = __ds_scope.BeanCard;

__ds_ns.RadarChart = __ds_scope.RadarChart;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Collapsible = __ds_scope.Collapsible;

__ds_ns.ControlButton = __ds_scope.ControlButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.RatingScale = __ds_scope.RatingScale;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Slider = __ds_scope.Slider;

__ds_ns.Toggle = __ds_scope.Toggle;

__ds_ns.ProgressSteps = __ds_scope.ProgressSteps;

__ds_ns.TimerDisplay = __ds_scope.TimerDisplay;

})();
