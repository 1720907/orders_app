// add-edit-order.js
import React,{useState, useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Container from '@mui/material/Container';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import {
    Button,
    Modal,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
  } from '@mui/material';
import {  Grid } from '@mui/material';
import { useLocation } from 'react-router-dom';

const AddOrder = () => {

    const location = useLocation();
    const params = new URLSearchParams(location.search);    
    const control= params.has('ID_ORDER');
    let url3="http://localhost:4500/api/Orders/";
    
    const url1 = "http://localhost:4500/api/Products";
    const url2 = "http://localhost:4500/api/Orders";
    const [Orders,setOrders]=useState([]);
    const [Products, setProducts] = useState([]);
    const [order_products,setOrderProducts]=useState([]);
    const [Order,setOrder]=useState([]);

    const [orderNumber, setOrderNumber] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);
    let a;
    let ID_ORDER;

    const getOrders = async () => {
        try {
            const res = await axios.get(url2);
            setOrders(res.data);
        } catch (error) {
            console.error("Error fetching Orders:", error);
        }
    }
    useEffect(() => {
        getOrders();
    }, []);
    
    if (control){
        ID_ORDER = Number(params.get('ID_ORDER'));
        url3 = url3+ID_ORDER;
        a = (<h1>Edit Order</h1>);
    }else{
        
        const findMaxId = (orders) => {
            const idMasAlto = orders.reduce((maxId, order) => {
              return order.ID_ORDER> maxId ? order.ID_ORDER : maxId;
            }, 0);
          
            return idMasAlto;
        };
        if(Orders.length >0){ 
            ID_ORDER=findMaxId(Orders)+1;
        }else{
            ID_ORDER=1;
        }
        a = (<h1>Add Order</h1>);
        url3 = url3+ID_ORDER;
    }

    const url = "http://localhost:4500/api/orderProducts/";

    const getProducts = async () => {
        try {
            const res = await axios.get(url1);
            setProducts(res.data);
        } catch (error) {
            console.error("Error fetching Orders:", error);
        }
    }
    useEffect(() => {
        getProducts();
    }, [order_products]);
    const getOrder=async () =>{
        try {
          const res = await axios.get(url3);
          setOrder(res.data);
        } catch (error) {
          console.error("Error fetching Orders:", error);
        }
      }
      useEffect(()=>{
         if(control){
            try{
                getOrder();
                setOrderNumber(Order[0].ORDER_N);
                setProductCount(Order[0].N_PRODUCTS);
                setFinalPrice(Order[0].FINAL_PRICE);  
            }catch(e){
                console.log("Bad form");
            }
         }
      },[Orders, ID_ORDER]);

    

    const getOrderProducts = async () => {
        try {
            const res = await axios.get(url+ID_ORDER);
            setOrderProducts(res.data);
        } catch (error) {
            console.error("Error fetching Orders:", error);
        }
    }
    useEffect(() => {
        if(control){
            try{
                getOrderProducts();
            }catch(e){
                console.log("Bad form");
            }        
        }
        
    }, [Orders,ID_ORDER]);

    useEffect(() => {
        if(order_products.length===0){
            setFinalPrice(0);
        }
    },[order_products]);

    
    
    //----------------------------------------------------------------------
    //creating a new order or editing a order
    //url2 for order, url for order_products
    const [modalInsertOrder, setModelInsertOrder] = useState(false);

    const handleFinishOrder = () => {
        setModelInsertOrder(true);
    };

    const handleFinishConfirm = async () => {
        //logic to add a order
        const order ={ID_ORDER: ID_ORDER, ORDER_N: orderNumber,DATE: new Date().toISOString().slice(0, 19).replace("T", " "), N_PRODUCTS: productCount, FINAL_PRICE : finalPrice};
        if(control){
            await axios.put(`${url2}`, order, {
                headers: {
                    'Content-Type': "application/json"
                }
            })
                .then(response => {
                    console.log("Response:", response.data);
                })
                .catch(error => {
                    console.error("Error while request", error);
                });

            //delete entries of order products
            await axios.delete(`${url}${ID_ORDER}`)
            .then(response => {
                console.log("Response", response.data);
            })
            .catch(error => {
                console.log(("Error while request", error));
            });
            //send elements in local order_products
            await axios.post(`${url}`, order_products, {
                headers: {
                    'Content-type': "application/json"
                }
            })
                .then(response => {
                    console.log("Response", response.data)
                })
                .catch(error => {
                    console.log(("Error while request", error));
                })
 
        }else{
            axios.post(`${url2}`, order, {
                headers: {
                    'Content-Type': "application/json"
                }
            })
                .then(response => {
                    console.log("Response:", response.data);
                })
                .catch(error => {
                    console.error("Error while request", error);
                });
            

            //logic to add order_products
            axios.post(`${url}`, order_products, {
                headers: {
                    'Content-type': "application/json"
                }
            })
                .then(response => {
                    console.log("Response", response.data)
                })
                .catch(error => {
                    console.log(("Error while request", error));
                })            
        }
        setModelInsertOrder(false);
        setOrderNumber(0);
        setProductCount(0);
        setFinalPrice(0);
        setOrderProducts([]);
        
    }

    const handleFinishCancel = () => {
        setModelInsertOrder(false);
    }
    
    //-------------------------------------------------------------------------------
    const style = {
        position: 'absolute',
        padding:10 +"px",
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height:300,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    //------------------------------------------------------------------------------
    //adding a product

    const idExists = (matriz, id) => {
        return matriz.some(element => element.ID_PRODUCT === id);
    };
    const [modalAddOpen, setModalAddOpen] = useState(false);
    const [productIdToAdd, setProductIdToAdd] = useState(null);
    const [cantidad, setCantidad] = useState(0);

    const handleAddClick = () =>{
        setModalAddOpen(true);
    }

    const handleAddConfirmed = () =>{
        //logic to add product
        const exists = idExists(order_products, productIdToAdd);
        if(exists){
            alert("This type of product exists in the order");
        }else{
            if(cantidad<=0){
                alert("Quantity must be natural greater than 0");
            }
            else{
                const nuevo = {
                    ID_ORDER: Number(ID_ORDER),
                    ID_PRODUCT: productIdToAdd,
                    QT: Number(cantidad)
                }
                setOrderProducts([...order_products, nuevo]);
                setModalAddOpen(false);
                setProductIdToAdd(null);
                setCantidad(0);
                setProductCount(productCount + 1);
                setFinalPrice(finalPrice + Products.find((element) => element.ID_PRODUCT === productIdToAdd).UNIT_PRICE * nuevo.QT);                   
            }
                   
        }
        
    }

    const handleModalAddClose = () =>{
        setModalAddOpen(false);
        setProductIdToAdd(null);
        setCantidad(0);
    }

    //------------------------------------------------------------------------------
    //edit

    const editElementbyId=(matrix, id, newvalue)=>{
        return matrix.map(element => {
            const { ID_ORDER, ID_PRODUCT, ...rest } = element;
    
            if (ID_ORDER === ID_ORDER && ID_PRODUCT === id) {
                return {
                    ID_ORDER,
                    ID_PRODUCT,
                    ...rest,
                    QT: Number(newvalue)
                };
            }
            else{
               return element; 
            }

            
        });
    };
    
    const [modalEditOpen,setModalEditOpen] = useState(false);
    const [productIdToEdit,setProductIdToEdit] = useState(null);
    const [new_qt, setNewQT] = useState(0);
    const [name, setName] =useState('');


    const handleEditClick = (product_id) => {
        try{
            order_products.forEach((element)=>{
                console.log(element);
            });
            setProductIdToEdit(product_id);
            const el = order_products.find((element) => element.ID_ORDER === ID_ORDER && element.ID_PRODUCT === product_id);
            setNewQT(el.QT);
            setName(Products.find((element) => element.ID_PRODUCT === product_id).NAME);
            setModalEditOpen(true);
        }catch(e){
            console.log("Error: ",e);
        }
        
    };

    const handleEditConfirm = () =>{
        const productToEdit = Products.find((element) => element.ID_PRODUCT===productIdToEdit);
        const oldQT = order_products.find((element) => element.ID_ORDER===ID_ORDER && element.ID_PRODUCT===productIdToEdit).QT;
        const adjustFinalPrice = finalPrice - productToEdit.UNIT_PRICE*oldQT;
        
        const updateOrderProducts = editElementbyId(order_products, productIdToEdit, new_qt);
        const newFinalPrice=adjustFinalPrice+productToEdit.UNIT_PRICE*new_qt;
        setFinalPrice(newFinalPrice);
        setOrderProducts(updateOrderProducts);
        setModalEditOpen(false);
        setNewQT(0);
        setName('');    
        setProductIdToEdit(null);
    };
    const handleModalEditClose = () => {
        setNewQT(0);
        setName('');
        setModalEditOpen(false);
        setProductIdToEdit(null);
    }



    //------------------------------------------------------------------------------
    //delete
    const eliminarElementoPorId = (matriz, idAEliminar) => {
        const nuevaMatriz = matriz.filter(elemento => elemento.ID_PRODUCT !== idAEliminar);
        return nuevaMatriz;
    };
    const [modalOpen, setModalOpen] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState(null);

    const handleDeleteClick=(product_id)=>{
        setProductIdToDelete(product_id);
        setModalOpen(true);
    };

    const handleDeleteConfirmed = ()=>{
        //logic to delete
        setFinalPrice(finalPrice-(Products.find((element)=>element.ID_PRODUCT===productIdToDelete).UNIT_PRICE * order_products.find((element)=>element.ID_ORDER===ID_ORDER && element.ID_PRODUCT===productIdToDelete).QT));
        setOrderProducts(eliminarElementoPorId(order_products,productIdToDelete));
        setModalOpen(false);
        setProductIdToDelete(null);
        setProductCount(productCount-1);
        if(productCount===0){
            setFinalPrice(0);
        }
    }

    const handleModalClose = () => {
        setModalOpen(false);
        setProductIdToDelete(null);
    }


    return (
        <Container>
            <Button
                variant="contained"
                color="primary"
                style={{ marginTop: '16px' }}
            >
                <a href="/my-orders"><ArrowBackIcon></ArrowBackIcon></a>
            </Button>
            <div style={{display:"flex",alignItems: "center",justifyContent:"center",fontSize:25+"px"}}>
                {a}
            </div>
            <form>
            <Grid container spacing={5}>
                <Grid item xs={6}>
                <TextField
                    label="Order#"
                    variant="outlined"
                    fullWidth
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                />
                </Grid>
                <Grid item xs={6}>
                <TextField
                    label="Date"
                    variant="outlined"
                    fullWidth
                    disabled
                    value={new Date().toLocaleString()}
                />
                </Grid>
                <Grid item xs={6}>
                <TextField
                    label="# Productos"
                    variant="outlined"
                    fullWidth
                    value={productCount} 
                    disabled
                />
                </Grid>
                <Grid item xs={6}>
                <TextField
                    label="Precio Final"
                    variant="outlined"
                    fullWidth
                    value={finalPrice}
                    disabled
                />
                </Grid>
            </Grid>
            <div style={{padding: 2 + "em"}}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddClick}
                    style={{ marginTop: '16px' }}
                >
                    Add new Product
                </Button>

                
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 + "px" }}>
              <h1>Available products</h1>
            </div>
            <div style={{ paddingLeft: 8 + 'em', paddingRight: 8 + 'em' }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell >Unit Price</TableCell>
                                <TableCell >Qty</TableCell>
                                <TableCell >Total Price</TableCell>
                                <TableCell >Options</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order_products.map((row) => (
                                <TableRow
                                    key={row.ID_ORDER-row.ID_PRODUCT}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.ID_PRODUCT}
                                    </TableCell>
                                    <TableCell >{Products.find((element)=>element.ID_PRODUCT===row.ID_PRODUCT).NAME}</TableCell>
                                    <TableCell >{Products.find((element)=>element.ID_PRODUCT===row.ID_PRODUCT).UNIT_PRICE}</TableCell>
                                    <TableCell >{row.QT}</TableCell>
                                    <TableCell >{Products.find((element)=>element.ID_PRODUCT===row.ID_PRODUCT).UNIT_PRICE * row.QT}</TableCell>

                                    <TableCell align="left">
                                        <Button variant="outlined" startIcon={<DeleteIcon />} onClick={()=>handleDeleteClick(row.ID_PRODUCT)}>
                                            Delete
                                        </Button>
                                        &nbsp;
                                        <Button variant="outlined" startIcon={<EditIcon />} onClick={()=>handleEditClick(row.ID_PRODUCT)}>
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div style={{padding: 1 + "em"}}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleFinishOrder}
                    style={{ marginTop: '16px', marginLeft: '16px' }}
                >
                    Save
                </Button>
            </div>
            
            </form>

            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Grid container sx={style}>
                    <div >
                        <h2 id="modal-title">¿Are you sure you want to delete this item?</h2>
                        <Button onClick={handleDeleteConfirmed} variant="contained" color="error">Delete</Button>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button onClick={handleModalClose} variant="outlined" color="primary">Cancel</Button>
                    </div>
                </Grid>
                
            </Modal>

            <Modal
                open={modalAddOpen}
                onClose={handleModalAddClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Grid container sx={style}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                        <h2 id="modal-title">Add Product</h2>
                        <FormControl fullWidth>
                            <InputLabel id="producto-label">Product</InputLabel>
                            <Select
                                labelId="producto-label"
                                id="producto"
                                value={productIdToAdd}

                                onChange={(e) => setProductIdToAdd(e.target.value)}
                                label="Producto"
                            >
                                {Products.map((producto) => (
                                    <MenuItem key={producto.ID_PRODUCT} value={producto.ID_PRODUCT}>
                                        {producto.NAME}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Quantity"
                            type="number"
                            fullWidth
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                            margin="normal"
                        />

                        <div>
                            <Button onClick={handleModalAddClose} color="secondary">
                                Cancel
                            </Button>
                            <Button onClick={handleAddConfirmed} color="primary">
                                Add Product
                            </Button>
                        </div>
                    </div>
                </Grid>
            </Modal>
            <Modal
                open={modalEditOpen}
                onClose={handleModalEditClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Grid container sx={style}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                        <h2 id="modal-title">Edit Product</h2>
                        
                        <TextField
                            label="Name"
                            type="text"
                            fullWidth
                            value={name}
                            margin="normal"
                            disabled
                        />

                        <TextField
                            label="Quantity"
                            type="number"
                            fullWidth
                            value={new_qt}
                            onChange={(e) => setNewQT(e.target.value)}
                            margin="normal"
                        />

                        <div>
                            <Button onClick={handleModalEditClose} color="secondary">
                                Cancel
                            </Button>
                            <Button onClick={handleEditConfirm} color="primary">
                                Edit Product
                            </Button>
                        </div>
                    </div>
                </Grid>
            </Modal>
            <Modal
                open={modalInsertOrder}
                onClose={handleFinishCancel}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Grid container sx={style}>
                    <div >
                        <h2 id="modal-title">¿Are you sure you want to create a new order?</h2>
                        <Button onClick={handleFinishConfirm} variant="contained" color="error">Confirm</Button>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button onClick={handleFinishCancel} variant="outlined" color="primary">Cancel</Button>
                    </div>
                </Grid>
                
            </Modal>
            
        </Container>
    );
};

export default AddOrder;