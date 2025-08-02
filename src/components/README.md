# Estructura de Componentes - Atomic Design

Esta aplicación sigue los principios del **Atomic Design** para organizar los componentes React de manera escalable y mantenible.

## Estructura

```
src/components/
├── atoms/          # Elementos básicos e indivisibles
├── molecules/      # Grupos de átomos que funcionan juntos
├── organisms/      # Grupos de moléculas y átomos que forman secciones completas
├── templates/      # Layouts que organizan organismos
└── index.js        # Exportaciones centralizadas
```

## Átomos (Atoms)

Los átomos son los elementos más básicos de la interfaz de usuario. No pueden dividirse más sin perder su funcionalidad.

- **Button**: Botón reutilizable con diferentes variantes y tamaños
- **Input**: Campo de entrada personalizable 
- **Icon**: Componente para mostrar íconos/emojis
- **Badge**: Etiqueta para mostrar información como puntuaciones
- **SocialLink**: Enlace social básico

### Ejemplo de uso:
```jsx
import { Button, Icon } from '../components/atoms'

<Button variant="primary" size="large" onClick={handleClick}>
  <Icon icon="🚀" /> Launch
</Button>
```

## Moléculas (Molecules)

Las moléculas combinan átomos para crear elementos más complejos pero aún reutilizables.

- **ScoreDisplay**: Muestra la puntuación del usuario
- **ToolCard**: Tarjeta individual de herramienta en la landing page
- **WordCard**: Contenedor para ejercicios de palabras
- **Breadcrumb**: Navegación de migas de pan
- **SocialButton**: Botón de compartir en redes sociales con funcionalidad completa

### Ejemplo de uso:
```jsx
import { ScoreDisplay, WordCard } from '../components/molecules'

<ScoreDisplay score={{ correct: 8, total: 10 }} />
<WordCard>
  {/* Contenido del ejercicio */}
</WordCard>
```

## Organismos (Organisms)

Los organismos combinan moléculas y átomos para formar secciones completas de la interfaz.

- **Hero**: Sección hero de la página principal
- **ToolsGrid**: Grid completo de herramientas disponibles
- **SocialSharing**: Sección completa para compartir en redes sociales
- **ArticleExercise**: Ejercicio completo de artículos holandeses
- **VerbExercise**: Ejercicio completo de conjugación de verbos

### Ejemplo de uso:
```jsx
import { Hero, ToolsGrid, SocialSharing } from '../components/organisms'

<Hero />
<ToolsGrid tools={tools} onToolClick={handleToolClick} />
<SocialSharing title="Mi App" description="Descripción" onShare={handleShare} />
```

## Templates

Los templates definen la estructura de la página organizando los organismos.

- **PageLayout**: Layout base para páginas con breadcrumb y footer opcionales

### Ejemplo de uso:
```jsx
import { PageLayout } from '../components/templates'

<PageLayout 
  showBreadcrumb 
  breadcrumbPage="Mi Página"
  onHomeClick={() => navigate('/')}
  footer={<p>Pie de página</p>}
>
  {/* Contenido de la página */}
</PageLayout>
```

## Beneficios de esta estructura

1. **Reutilización**: Los componentes pueden reutilizarse en diferentes contextos
2. **Mantenibilidad**: Cada componente tiene una responsabilidad específica
3. **Escalabilidad**: Fácil agregar nuevos componentes siguiendo la misma estructura
4. **Consistencia**: Interfaz uniforme en toda la aplicación
5. **Testabilidad**: Componentes pequeños y enfocados son más fáciles de testear

## Importaciones

Puedes importar componentes de diferentes formas:

```jsx
// Importación individual
import Button from '../components/atoms/Button'

// Importación desde índices de nivel
import { Button, Icon } from '../components/atoms'

// Importación desde índice central
import { Button, ScoreDisplay, Hero } from '../components'
```

## Convenciones

- Un componente por archivo
- Nombres en PascalCase
- Props bien tipadas con valores por defecto
- Estilos inline para componentes reutilizables (permite customización)
- Documentación clara de las props esperadas