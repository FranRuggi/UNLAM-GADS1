# Decisiones abiertas de la maqueta de frontend

Decisiones que surgieron al construir la maqueta y que conviene cerrar antes de conectar el backend. Complementan `decisiones-pendientes.md`, que trata el dominio y la arquitectura; acá sólo va lo que nace del diseño de pantallas.

Cada `DF` indica qué se hizo provisoriamente en la maqueta, para que la decisión se tome sobre algo concreto y no en abstracto.

| ID | Tema | Estado | Fecha límite sugerida |
|---|---|---|---|
| DF-01 | Estrategia de estilos: CSS Modules o framework de utilidades | Provisoria | 02/10 |
| DF-02 | Iconografía propia frente a librería | Provisoria | 02/10 |
| DF-03 | Prerenderizado de las páginas públicas | **Abierta, bloquea SEO real** | 20/09 |
| DF-04 | Dominio definitivo y URL canónica | Resuelta técnicamente, falta elegir dominio | 02/10 |
| DF-05 | Destino del formulario de contacto | Abierta | 02/10 |
| DF-06 | Validación de formularios y presentación de errores | Abierta | 02/10 |
| DF-07 | Interacción del embudo: arrastrar o menú de etapa | Abierta | 02/10 |
| DF-08 | Modo oscuro | Diferida | Después de la entrega final |
| DF-09 | Hosting del frontend: Vercel frente a Cloudflare Pages | **Abierta, se desvía de la arquitectura aprobada** | 02/10 |

---

## DF-01 — Estrategia de estilos

**En la maqueta:** CSS Modules con tokens en custom properties, sin framework de utilidades. Un archivo `.module.css` por componente o pantalla.

**Por qué:** da una identidad visual propia derivada del logo, mantiene el CSS final en 59 kB sin purga ni configuración, y evita que el marcado se llene de clases utilitarias. El costo es que no hay autocompletado de clases ni convención impuesta.

**A decidir:** si el equipo sostiene esta estrategia o prefiere Tailwind. Si se cambia, conviene hacerlo antes de sumar pantallas: migrar 25 archivos de estilos después es caro.

---

## DF-02 — Iconografía

**En la maqueta:** set propio de 40 iconos SVG inline en `shared/components/Icono.tsx`, trazo de 1.6 sobre grilla de 24.

**Por qué:** evita una dependencia de ~50 kB por una necesidad acotada y garantiza coherencia de trazo con la tipografía.

**A decidir:** si al crecer el producto conviene pasar a `lucide-react`. El componente `Icono` ya aísla la decisión: cambiar la implementación no toca las pantallas.

---

## DF-03 — Prerenderizado de las páginas públicas

**En la maqueta:** los metadatos se aplican en tiempo de ejecución con el hook `useSeo`. El HTML servido es el mismo para las cinco rutas públicas.

**El problema:** Googlebot ejecuta JavaScript y va a ver los metadatos correctos, pero otros rastreadores no. Más concreto: **las tarjetas de WhatsApp, LinkedIn, X y Slack no ejecutan JavaScript**, así que hoy cualquier enlace compartido del sitio muestra el título y la descripción genéricos de `index.html`, no los de la página compartida.

**Opciones:**

1. `vite-react-ssg`: genera HTML estático por ruta en el build. Es el camino más directo con el stack actual.
2. Prerender en el pipeline de despliegue de Cloudflare Pages.
3. No hacer nada y aceptar la limitación, si el sitio público no se va a difundir.

**Recomendación:** opción 1, antes de publicar. El trabajo estimado es de unas pocas horas y no afecta a la aplicación, que no se indexa.

---

## DF-04 — Dominio y URL canónica

**Resuelto en lo técnico.** El dominio dejó de estar escrito a mano en tres lugares. Ahora sale de `VITE_SITE_URL`, que resuelve `vite.config.ts` y que alimenta tres cosas a la vez: la constante `SITIO.url`, el `sitemap.xml` y el `robots.txt`, ambos generados durante el build en lugar de versionarse.

El orden de resolución es:

1. `VITE_SITE_URL`, si está definida.
2. `VERCEL_PROJECT_PRODUCTION_URL`, que Vercel inyecta solo en cada build.
3. `http://localhost:5173` en desarrollo.

Gracias al punto 2, un despliegue en Vercel produce canónicas y sitemap correctos aunque nadie configure nada.

**Lo que falta decidir:** si el proyecto se queda con el subdominio gratuito de la plataforma o registra un dominio propio. Si se registra uno, alcanza con definir `VITE_SITE_URL` en el panel del hosting; no hay que tocar código.

**Nota:** `contacto@ztechcrm.com.ar` sigue siendo una dirección ficticia del contenido, independiente de esta decisión (ver DF-05).

---

## DF-05 — Formulario de contacto

**En la maqueta:** el envío muestra el estado de confirmación y no sale del navegador.

**Opciones:** un endpoint propio en el backend Spring; un servicio externo de formularios; o un enlace `mailto:` y quitar el formulario.

**A decidir también:** qué pasa con los datos que se envían, para que la Política de Privacidad (sección de datos recolectados) siga siendo cierta cuando el formulario funcione.

---

## DF-06 — Validación de formularios

**En la maqueta:** sólo atributos HTML (`required`, `type`, `min`, `max`) y `noValidate` en el `form`, así que no se valida nada al enviar. No hay estados de error diseñados.

**A definir antes de implementar con React Hook Form y Zod:**

- Cuándo se valida: al perder el foco, al escribir o al enviar.
- Dónde se muestra el error: bajo el campo, en un resumen arriba, o ambos.
- Cómo se presentan los errores que devuelve el backend, incluido el `409 Conflict` por superposición de reservas.
- Qué mensajes se usan. Conviene un catálogo único en español, no mensajes sueltos por campo.

El componente `Campo` ya reserva el lugar del texto de ayuda; falta la variante de error.

---

## DF-07 — Interacción del embudo

**En la maqueta:** el tablero es de sólo lectura. En el detalle de la oportunidad hay un selector visual de etapas que cambia la selección en pantalla sin guardar.

**A decidir:** si el cambio de etapa se hace arrastrando la ficha (requiere una librería de drag and drop y una solución accesible por teclado) o con un menú en la ficha. La consigna admite las dos: pide que el cambio se pueda hacer desde el detalle o desde el tablero.

**Nota de accesibilidad:** si se elige arrastrar, hace falta una alternativa por teclado. Un menú en la ficha sirve para ambas cosas y es bastante más barato.

---

## DF-08 — Modo oscuro

**En la maqueta:** no está. La paleta de tokens está definida sólo en claro.

**Por qué se difirió:** duplica el trabajo de color y de verificación, y no forma parte de ninguna consigna.

**Si se decide sumarlo:** los tokens ya están centralizados en `tokens.css`, así que alcanza con redefinir el bloque de color bajo `prefers-color-scheme: dark` y revisar las pantallas. No es una decisión irreversible.

---

## DF-09 — Hosting del frontend

**La arquitectura aprobada dice Cloudflare Pages** (`docs/arquitectura/01-arquitectura-general.md`). La maqueta se está publicando en **Vercel**, así que hay una desviación explícita que el equipo tiene que confirmar o revertir.

**Estado del repositorio:** conviven las dos configuraciones.

- `frontend/vercel.json`: reescrituras de SPA, cabeceras de caché para `/assets/*` y cabeceras de seguridad básicas.
- `frontend/public/_redirects`: el equivalente para Cloudflare Pages. Vercel lo ignora.

Ninguna de las dos molesta a la otra, así que mantener ambas cuesta nada mientras la decisión esté abierta.

**A favor de Vercel:** integración con GitHub sin configuración, previsualización por rama, y detección automática de Vite.

**A favor de Cloudflare Pages:** es lo que dice el documento de arquitectura, y el backend en Render más la base en Neon ya reparten el despliegue entre varios proveedores.

**A decidir:** cuál queda. Si se confirma Vercel, hay que actualizar el documento de arquitectura y borrar `_redirects`. Si se vuelve a Cloudflare, se borra `vercel.json`.

---

## Nota sobre el contenido generado

Los textos legales, el copy institucional y los datos de demostración se redactaron con asistencia de agentes de IA, con instrucciones explícitas de no inventar clientes, métricas, certificaciones ni trayectoria, y de declarar el carácter académico del proyecto. Después se revisaron y corrigieron a mano.

Los textos legales **no fueron revisados por un profesional del derecho**. Son razonables para un trabajo práctico, pero si el producto llegara a usarse con datos reales de terceros hay que revisarlos, sobre todo lo relativo a la Ley 25.326 y al rol de encargado del tratamiento.
