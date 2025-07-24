document.addEventListener("DOMContentLoaded", () => {
  const cursos = {};

  // Semestre I (ejemplo)
  cursos["I"] = [
    { id: "biocel", nombre: "Biología Celular y Molecular", abre: ["morfo1", "anato", "genet", "crecimiento", "preinternado", "investigacion", "intcir", "intgine", "intmed", "intped"] },
    { id: "quimica", nombre: "Química", abre: ["bioq", "preinternado", "investigacion", "intcir", "intgine", "intmed", "intped"] },
    { id: "matematica", nombre: "Matemática", abre: ["estad", "preinternado", "investigacion", "intcir", "intgine", "intmed", "intped"] },
    { id: "lengua", nombre: "Lengua y Oratoria", abre: ["introinv", "redaccion", "preinternado", "investigacion", "intcir", "intgine", "intmed", "intped"] },
    { id: "introMed", nombre: "Introducción a la Medicina", abre: ["bioetica", "preinternado", "investigacion", "intcir", "intgine", "intmed", "intped"] },
    { id: "desemp", nombre: "Desempeño Universitario", abre: ["realidad", "preinternado", "investigacion", "intcir", "intgine", "intmed", "intped"] }
  ];

  const contenedor = document.getElementById("contenedor");
  const aprobados = JSON.parse(localStorage.getItem("aprobados")) || [];

  const mapaPrereq = {};
  for (const semestre in cursos) {
    cursos[semestre].forEach((curso) => {
      curso.abre.forEach((abierto) => {
        if (!mapaPrereq[abierto]) mapaPrereq[abierto] = [];
        mapaPrereq[abierto].push(curso.id);
      });
    });
  }

  function render() {
    contenedor.innerHTML = "";
    for (const semestre in cursos) {
      const div = document.createElement("div");
      div.className = "semestre";
      const h3 = document.createElement("h3");
      h3.textContent = `Semestre ${semestre}`;
      div.appendChild(h3);

      cursos[semestre].forEach((curso) => {
        const el = document.createElement("div");
        el.className = "curso";
        el.dataset.id = curso.id;
        el.textContent = curso.nombre;

        const prereq = mapaPrereq[curso.id] || [];
        const desbloqueado = prereq.every((p) => aprobados.includes(p));

        el.classList.add(desbloqueado ? "desbloqueado" : "bloqueado");
        if (aprobados.includes(curso.id)) el.classList.add("aprobado");

        el.addEventListener("click", () => {
          if (!el.classList.contains("desbloqueado")) return;
          const idx = aprobados.indexOf(curso.id);
          if (idx >= 0) aprobados.splice(idx, 1);
          else aprobados.push(curso.id);
          localStorage.setItem("aprobados", JSON.stringify(aprobados));
          render();
          actualizarProgreso();
        });

        div.appendChild(el);
      });
      contenedor.appendChild(div);
    }
  }

  function actualizarProgreso() {
    const total = Object.values(cursos).flat().length;
    const pct = Math.round((aprobados.length / total) * 100);
    document.getElementById("progreso").textContent = `Progreso: ${pct}%`;
  }

  render();
  actualizarProgreso();
});
