
# Dokumentasi API

Created by Muhammad Fikri Alfarizi


## API Reference

#### Login

```http
  POST /api/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| | `string` | |

#### Create Users

```http
  POST /api/users/create
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| | `string` | |

#### Create Order

```http
  POST /api/order/create
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|       | `string` | **Required**. auth token |

#### Get Order

```http
  GET /api/order/getall
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|       | `string` | **Required**. auth token |

#### Get Personel

```http
  GET /api/personel/getall/:order
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|   `order`    | `string` | **Required**. auth token |

#### Add Personel

```http
  POST /api/personel/add/:order
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|    `order`   | `string` | **Required**. auth token |


#### Absen Personel

```http
  POST /api/personel/absen/:order
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|    `order`   | `string` | **Required**. auth token |


#### Get Absen

```http
  GET /api/personel/absen/getall/:order/:tanggal
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|    `order`,`tanggal`   | `string` | **Required**. auth token |

#### Update Personel

```http
  PUT /api/personel/update/:order/:name
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|    `order`,`name`   | `string` | **Required**. auth token |


#### Delete Personel

```http
  DELETE /api/personel/delete/:order/:name
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|    `order`,`name`   | `string` | **Required**. auth token |

#### Add Peralatan

```http
  POST /api/peralatan/add/:order
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|    `order`   | `string` | **Required**. auth token |

#### Get Peralatan by date

```http
  GET /api/peralatan/getall/:order/:tanggal
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|    `order`,`tanggal`   | `string` | **Required**. auth token |

#### Get Peralatan

```http
  GET /api/peralatan/getall/:order
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|    `order`   | `string` | **Required**. auth token |


#### Add Daily

```http
  POST /api/daily/add/:order
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|    `order`   | `string` | **Required**. auth token |

#### Get Daily By Date

```http
  GET /api/daily/getall/:order/:tanggal
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|    `order`,`tanggal`   | `string` | **Required**. auth token |

#### Get Daily

```http
  GET /api/daily/getall/:order
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|    `order`   | `string` | **Required**. auth token |


#### Add Indeks

```http
  POST /api/indeks/add/:order
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|    `order`   | `string` | **Required**. auth token |

#### Get Indeks By Date

```http
  GET /api/indeks/getall/:order/:tanggal
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|    `order`,`tanggal`   | `string` | **Required**. auth token |

#### Get Indeks

```http
  GET /api/indeks/getall/:order
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|    `order`   | `string` | **Required**. auth token |


#### Add Inspeksi

```http
  POST /api/inspeksi/add/:order
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|    `order`   | `string` | **Required**. auth token |



#### Get Inspeksi

```http
  GET /api/inspeksi/getall/:order
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|    `order`   | `string` | **Required**. auth token |


#### Add Pemakaian

```http
  POST /api/pemakaian/add/:order
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|    `order`   | `string` | **Required**. auth token |

#### Get Pemakaian By Date

```http
  GET /api/pemakaian/getall/:order/:tanggal
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|    `order`,`tanggal`   | `string` | **Required**. auth token |

#### Get Pemakaian

```http
  GET /api/pemakaian/getall/:order
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|    `order`   | `string` | **Required**. auth token |