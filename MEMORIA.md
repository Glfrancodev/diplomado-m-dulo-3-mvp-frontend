# MEMORIA — Sesión Frontend MVP

## Ramas
- **main**: base inicial con 2 commits
- **feat/api-integration**: rama activa con todos los cambios (push realizada)

## Commits realizados (5)

| Commit | Descripción |
|--------|-------------|
| `7a5e557` | Tailwind theme (brand/gold/mint), dark mode, `.env.template` |
| `c411134` | Shared components con dark mode, ThemeProvider, utilerías |
| `813605e` | API layer: health endpoint, query params, `ApiError` class |
| `c985040` | Módulos: types alineados, order store enriquecido, hooks |
| `fb76448` | `HealthPage`, ruteo, Dashboard corregido |

## Estado actual del frontend

### Consumo de API — Completado
- [x] Query params opcionales en `clientsApi.getAll(isActive?)`, `productsApi.getAll(isActive?)`, `ordersApi.getAll({ status?, customerId? })`
- [x] `customerName` enriquecido desde `useClientStore` en OrderStore
- [x] `productName` enriquecido desde `useProductStore` en OrderStore
- [x] `items` opcional en `Order` (lista no trae items)
- [x] `fetchOrderById()` para detalle con items completos
- [x] `createdAt: string` en types Client y Product
- [x] Error handling: `ApiError` con `statusCode` y `errors[]` completo
- [x] `GET /health` endpoint + `HealthPage`
- [x] `OrderStatus` duplicado eliminado de shared/types

### Archivos clave

| Archivo | Propósito |
|---------|-----------|
| `src/shared/api/axiosInstance.ts` | Axios con interceptor que unwrappe el envelope y rechaza con `ApiError` |
| `src/shared/api/health.api.ts` | Endpoint `GET /health` |
| `src/modules/orders/store/index.ts` | Enriquecimiento de `customerName` y `productName` |
| `src/pages/HealthPage.tsx` | UI para health check |

### Stores (Zustand)
- `useClientStore` — clients[], CRUD, getActiveClients, getClientById
- `useProductStore` — products[], CRUD, getActiveProducts, getProductById, hasSufficientStock
- `useOrderStore` — orders[], currentOrder, fetchOrderById, createOrder, updateOrderStatus

### Hooks
- `useClients` — createClient, editClient, handleDeactivate
- `useProducts` — createProduct, editProduct, handleDeactivate
- `useOrders` — placeOrder (validación local de stock/cliente), changeStatus

### Páginas
- `/` — Dashboard con stats y últimos pedidos
- `/clients` — CRUD clientes con modal y confirmación
- `/products` — CRUD productos con modal y confirmación
- `/orders` — Listado de pedidos
- `/orders/new` — Formulario con selector cliente + productos dinámicos
- `/orders/:id` — Detalle con items y transiciones de estado
- `/health` — Health check manual

### Pendiente para próxima sesión
- Navegación de health en el sidebar de Layout
- Filtros UI en listados (isActive, status, customerId)
- Pruebas de integración contra backend real
- TypeScript: `ApiError` no se usa en todos los catch (algunos solo muestran `e.message`)
