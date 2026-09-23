import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ============================================================
// CWD IMAGES
// ============================================================

const cwdImages = import.meta.glob(
  "../../assets/CWD/images/*.{png,jpg,jpeg,webp,svg}",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

// ============================================================
// DIFFICULTY CONFIGURATION
// ============================================================

const DIFFICULTIES = {
  Beginner: "#0F6E56",
  Intermediate: "#185FA5",
  Advanced: "#993C1D",
};

const DIFFICULTY_BG = {
  Beginner: "#E1F5EE",
  Intermediate: "#E6F1FB",
  Advanced: "#FAECE7",
};

// ============================================================
// CONTENT VIEWER
// ============================================================

function ContentViewer({ content }) {
  return (
    <div
      className="prose"
      style={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        maxHeight: "75vh",
        overflowY: "auto",
        padding: 24,
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt, ...props }) => {
            let imageSrc = src;

            if (src?.startsWith("../images/")) {
              const imageName = src.split("/").pop();

              const imagePath =
                `../../assets/CWD/images/${imageName}`;

              if (cwdImages[imagePath]) {
                imageSrc = cwdImages[imagePath];
              }
            }

            return (
              <img
                src={imageSrc}
                alt={alt}
                {...props}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  display: "block",
                  margin: "24px auto",
                }}
              />
            );
          },
        }}
      >
        {content || "No concept available for this topic."}
      </ReactMarkdown>
    </div>
  );
}

// ============================================================
// CODE BLOCK
// ============================================================

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code || "");

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        marginTop: 16,
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
      }}
    >
      <button
        onClick={copy}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          padding: "4px 10px",
          borderRadius: 6,
          border:
            "0.5px solid var(--color-border-secondary)",
          background:
            "var(--color-background-secondary)",
          cursor: "pointer",
          fontSize: 12,
          color: "var(--color-text-secondary)",
          zIndex: 1,
        }}
      >
        {copied ? "✓ Copied" : "Copy"}
      </button>

      <pre
        style={{
          margin: 0,
          padding: "14px 16px",
          borderRadius: 10,
          overflowX: "auto",
          maxWidth: "100%",
          boxSizing: "border-box",
          background:
            "var(--color-background-secondary)",
          border:
            "0.5px solid var(--color-border-tertiary)",
          fontSize: 12,
          lineHeight: 1.65,
          fontFamily: "var(--font-mono)",
          color: "var(--color-text-primary)",
          whiteSpace: "pre",
        }}
      >
        <code>{code || "// No code available."}</code>
      </pre>
    </div>
  );
}

// ============================================================
// RECIPE CARD
// ============================================================

function RecipeCard({
  recipe,
  onSelect,
  selected,
}) {
  return (
    <div
      onClick={() => onSelect(recipe)}
      style={{
        padding: "16px 18px",
        borderRadius: 12,
        cursor: "pointer",

        border: selected
          ? "1.5px solid #185FA5"
          : "0.5px solid var(--color-border-tertiary)",

        background: selected
          ? "#061320"
          : "var(--color-background-primary)",

        transition: "all 0.15s",

        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Category + Difficulty */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 10,
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: 13,
            color: "var(--color-text-secondary)",
            fontWeight: 400,
            minWidth: 0,
            overflowWrap: "anywhere",
          }}
        >
          {recipe.category}
        </span>

        <span
          style={{
            fontSize: 11,
            padding: "2px 8px",
            borderRadius: 20,
            fontWeight: 500,
            background:
              DIFFICULTY_BG[recipe.difficulty] ||
              "#E6F1FB",
            color:
              DIFFICULTIES[recipe.difficulty] ||
              "#185FA5",
            flexShrink: 0,
          }}
        >
          {recipe.difficulty}
        </span>
      </div>

      {/* Question */}
      <div
        style={{
          fontWeight: 500,
          fontSize: 15,
          marginBottom: 4,
          color: "var(--color-text-primary)",
          overflowWrap: "anywhere",
        }}
      >
        {recipe.title}
      </div>
    </div>
  );
}

// ============================================================
// NAV BUTTON (Prev / Next)
// ============================================================

function NavBar({ onPrev, onNext, hasPrev, hasNext, position }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        marginTop: position === "bottom" ? 20 : 0,
        marginBottom: position === "top" ? 16 : 0,
      }}
    >
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        style={{
          padding: "8px 16px",
          borderRadius: 8,
          border: "0.5px solid var(--color-border-secondary)",
          background: "var(--color-background-secondary)",
          color: hasPrev
            ? "var(--color-text-primary)"
            : "var(--color-text-tertiary)",
          fontSize: 13,
          fontWeight: 500,
          cursor: hasPrev ? "pointer" : "not-allowed",
          opacity: hasPrev ? 1 : 0.5,
        }}
      >
        ← Previous
      </button>

      <button
        onClick={onNext}
        disabled={!hasNext}
        style={{
          padding: "8px 18px",
          borderRadius: 8,
          border: "none",
          background: hasNext ? "#185FA5" : "var(--color-background-secondary)",
          color: hasNext ? "#fff" : "var(--color-text-tertiary)",
          fontSize: 13,
          fontWeight: 500,
          cursor: hasNext ? "pointer" : "not-allowed",
          opacity: hasNext ? 1 : 0.5,
        }}
      >
        Next →
      </button>
    </div>
  );
}

// ============================================================
// RECIPE DETAIL
// ============================================================

function RecipeDetail({ recipe, recipeList, onSelect }) {
  const [tab, setTab] = useState("concept");

  const currentIndex = recipeList.findIndex(
    (r) => r.id === recipe.id
  );

  const hasPrev = currentIndex > 0;
  const hasNext =
    currentIndex >= 0 && currentIndex < recipeList.length - 1;

  const goPrev = () => {
    if (hasPrev) {
      setTab("concept");
      onSelect(recipeList[currentIndex - 1]);
    }
  };

  const goNext = () => {
    if (hasNext) {
      setTab("concept");
      onSelect(recipeList[currentIndex + 1]);
    }
  };

  return (
    <div
      style={{
        padding: 24,
        borderRadius: 14,
        background:
          "var(--color-background-primary)",
        border:
          "0.5px solid var(--color-border-tertiary)",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* TOP NAV */}
      <NavBar
        position="top"
        onPrev={goPrev}
        onNext={goNext}
        hasPrev={hasPrev}
        hasNext={hasNext}
      />

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            minWidth: 0,
            flex: "1 1 250px",
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: "var(--color-text-tertiary)",
            }}
          >
            {recipe.category}
          </span>

          <h2
            style={{
              margin: "4px 0 0",
              fontSize: 22,
              fontWeight: 500,
              overflowWrap: "anywhere",
            }}
          >
            {recipe.title}
          </h2>
        </div>

        {/* Difficulty + Time */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            paddingTop: 4,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 12,
              padding: "3px 10px",
              borderRadius: 20,
              fontWeight: 500,
              background:
                DIFFICULTY_BG[recipe.difficulty] ||
                "#E6F1FB",
              color:
                DIFFICULTIES[recipe.difficulty] ||
                "#185FA5",
            }}
          >
            {recipe.difficulty}
          </span>

          {recipe.time && (
            <span
              style={{
                fontSize: 12,
                color: "var(--color-text-tertiary)",
              }}
            >
              ⏱ {recipe.time}
            </span>
          )}
        </div>
      </div>

      {/* TABS */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 18,
          borderBottom:
            "0.5px solid var(--color-border-tertiary)",
          flexWrap: "wrap",
        }}
      >
        {["concept", "code"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 16px",
              border: "none",
              background: "none",
              cursor: "pointer",

              fontSize: 14,
              fontWeight:
                tab === t ? 500 : 400,

              color:
                tab === t
                  ? "var(--color-text-primary)"
                  : "var(--color-text-secondary)",

              borderBottom:
                tab === t
                  ? "2px solid #185FA5"
                  : "2px solid transparent",

              marginBottom: -1,
              transition: "all 0.12s",
            }}
          >
            {t === "concept" ? "Concept" : "Code"}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {tab === "concept" && (
        <ContentViewer content={recipe.concept} />
      )}

      {tab === "code" && (
        <CodeBlock code={recipe.code} />
      )}

      {/* BOTTOM NAV */}
      <NavBar
        position="bottom"
        onPrev={goPrev}
        onNext={goNext}
        hasPrev={hasPrev}
        hasNext={hasNext}
      />
    </div>
  );
}

// ============================================================
// SIDEBAR
// ============================================================

function Sidebar({
  recipes,
  categories,
  selected,
  onSelect,
  category,
  setCategory,
  search,
  setSearch,
}) {
  const filtered = recipes.filter((r) => {
    // Category filter
    const matchCategory =
      category === "All" ||
      r.category === category;

    // Search filter
    const searchText =
      search.trim().toLowerCase();

    const matchSearch =
      !searchText ||
      r.title
        ?.toLowerCase()
        .includes(searchText) ||
      r.category
        ?.toLowerCase()
        .includes(searchText);

    return matchCategory && matchSearch;
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        height: "100%",
      }}
    >
      {/* SEARCH */}
      <div
        style={{
          paddingBottom: 16,
        }}
      >
        <input
          type="text"
          placeholder="Search questions…"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",

            padding: "9px 12px",
            borderRadius: 8,

            border:
              "0.5px solid var(--color-border-secondary)",

            background:
              "var(--color-background-secondary)",

            color:
              "var(--color-text-primary)",

            fontSize: 13,
            outline: "none",
          }}
        />
      </div>

      {/* CATEGORY DROPDOWN */}
      <div
        style={{
          marginBottom: 16,
          width: "100%",
        }}
      >
        <label
          htmlFor="category-select"
          style={{
            display: "block",
            fontSize: 12,
            color: "var(--color-text-secondary)",
            marginBottom: 6,
            fontWeight: 500,
          }}
        >
          Category
        </label>

        <select
          id="category-select"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          style={{
            width: "100%",
            padding: "9px 12px",
            borderRadius: 8,

            border:
              "0.5px solid var(--color-border-secondary)",

            background:
              "var(--color-background-secondary)",

            color:
              "var(--color-text-primary)",

            fontSize: 13,
            cursor: "pointer",
            outline: "none",
            boxSizing: "border-box",
          }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* QUESTION LIST */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          overflowY: "auto",
          flex: 1,
          minHeight: 0,
        }}
      >
        {filtered.length === 0 ? (
          <div
            style={{
              color: "var(--color-text-tertiary)",
              fontSize: 13,
              padding: "12px 0",
            }}
          >
            No questions found.
          </div>
        ) : (
          filtered.map((r) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              onSelect={onSelect}
              selected={
                selected?.id === r.id
              }
            />
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================
// HEADER
// ============================================================

function Header({
  title,
  subtitle,
  icon,
  totalCount,
  categoryCount,
  patternLabel,
}) {
  return (
    <div
      style={{
        padding: "20px 32px 16px",

        borderBottom:
          "0.5px solid var(--color-border-tertiary)",

        display: "flex",
        alignItems: "center",

        gap: 16,
        flexWrap: "wrap",

        width: "100%",
        maxWidth: "100%",

        boxSizing: "border-box",
      }}
    >
      {/* ICON */}
      <div
        style={{
          width: 40,
          height: 40,
          minWidth: 40,

          borderRadius: 10,

          background: "#E6F1FB",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          fontSize: 20,
        }}
      >
        {icon}
      </div>

      {/* TITLE */}
      <div
        style={{
          minWidth: 0,
          flex: "1 1 220px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: "-0.3px",
            overflowWrap: "anywhere",
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color:
                "var(--color-text-secondary)",
              overflowWrap: "anywhere",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* STATISTICS */}
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            {totalCount}
          </div>

          <div
            style={{
              fontSize: 11,
              color:
                "var(--color-text-tertiary)",
            }}
          >
            Questions
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            {categoryCount}
          </div>

          <div
            style={{
              fontSize: 11,
              color:
                "var(--color-text-tertiary)",
            }}
          >
            {patternLabel}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COOKBOOK APP
// ============================================================

export default function CookbookApp({
  data,
  title,
  subtitle,
  icon = "📚",
  patternLabel = "Categories",
}) {
  const [selected, setSelected] =
    useState(data?.[0] || null);

  const [category, setCategory] =
    useState("All");

  const [search, setSearch] =
    useState("");

  // ==========================================================
  // BUILD UNIQUE CATEGORIES
  // ==========================================================

  const categories = [
    "All",
    ...new Set(
      data
        .map((r) => r.category)
        .filter(Boolean)
    ),
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",

        width: "100%",
        maxWidth: "100%",

        minHeight: "100vh",

        fontFamily:
          "var(--font-sans, system-ui, sans-serif)",

        background:
          "var(--color-background-tertiary, #020617)",

        color:
          "var(--color-text-primary)",

        boxSizing: "border-box",

        overflowX: "hidden",
      }}
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <Header
        title={title}
        subtitle={subtitle}
        icon={icon}
        totalCount={data.length}
        categoryCount={
          categories.length - 1
        }
        patternLabel={patternLabel}
      />

      {/* ======================================================
          MAIN LAYOUT
      ====================================================== */}

      <div
        className="cookbook-layout"
        style={{
          display: "flex",
          flex: 1,
          minHeight: 0,

          width: "100%",
          maxWidth: "100%",

          overflow: "hidden",
        }}
      >
        {/* ====================================================
            SIDEBAR
        ==================================================== */}

        <div
          className="cookbook-sidebar"
          style={{
            width: 320,
            minWidth: 260,

            padding: "20px",

            borderRight:
              "0.5px solid var(--color-border-tertiary)",

            background:
              "var(--color-background-primary)",

            overflowY: "auto",

            boxSizing: "border-box",

            flexShrink: 0,
          }}
        >
          <Sidebar
            recipes={data}
            categories={categories}
            selected={selected}
            onSelect={setSelected}
            category={category}
            setCategory={setCategory}
            search={search}
            setSearch={setSearch}
          />
        </div>

        {/* ====================================================
            CONTENT
        ==================================================== */}

        <div
          className="cookbook-content"
          style={{
            flex: 1,
            minWidth: 0,

            overflowY: "auto",
            overflowX: "hidden",

            padding: "24px 28px",

            boxSizing: "border-box",
          }}
        >
          {selected ? (
            <RecipeDetail
              recipe={selected}
              recipeList={data}
              onSelect={setSelected}
            />
          ) : (
            <div
              style={{
                color:
                  "var(--color-text-tertiary)",
                padding: 40,
                textAlign: "center",
              }}
            >
              Select a question to get started.
            </div>
          )}
        </div>
      </div>

      {/* ======================================================
          RESPONSIVE CSS
      ====================================================== */}

      <style>{`
        @media (max-width: 750px) {

          .cookbook-layout {
            display: flex !important;
            flex-direction: column !important;

            width: 100% !important;
            max-width: 100% !important;

            height: auto !important;
            min-height: 0 !important;

            overflow: visible !important;
          }

          .cookbook-sidebar {
            width: 100% !important;
            min-width: 0 !important;
            max-width: 100% !important;

            height: auto !important;
            max-height: none !important;

            flex-shrink: 1 !important;

            overflow: visible !important;

            border-right: none !important;

            border-bottom:
              0.5px solid
              var(--color-border-tertiary) !important;

            padding: 16px !important;
          }

          .cookbook-content {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;

            height: auto !important;
            min-height: 0 !important;

            overflow: visible !important;

            padding: 16px !important;

            box-sizing: border-box !important;
          }

          .cookbook-content .prose {
            max-height: none !important;

            overflow: visible !important;

            padding: 12px 0 !important;
          }

          .cookbook-content pre {
            max-width: 100% !important;

            overflow-x: auto !important;
          }
        }

        @media (max-width: 450px) {

          .cookbook-sidebar {
            padding: 12px !important;
          }

          .cookbook-content {
            padding: 12px !important;
          }

          .cookbook-content > div {
            padding: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}