import React,{useEffect, useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {
  Modal,
  Grid
} from '@mui/material';
import axios from 'axios';
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';
// import { show_alerta } from '../functions';

export default function Orders() {
  const style = {
    position: 'absolute',
    padding: 10 + "px",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 300,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const url = "http://localhost:4500/api/Orders";
  const [Orders,setOrders]=useState([]);

  const getOrders=async () =>{
    try {
      const res = await axios.get(url);
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching Orders:", error);
    }
  }
  useEffect(()=>{
     getOrders();
  },[]);

//------------------------------------------------------------------------------
//delete

  const [modalOpen, setModalOpen] = useState(false);
  const [orderIdToDelete, setOrderIdToDelete] = useState(null);


  const handleDelete=(order_id)=>{
    setOrderIdToDelete(order_id);
    setModalOpen(true);
  };

  useEffect(() => {
    getOrders();
  }, [modalOpen]);


  const path = "http://localhost:4500/api/Orders/"+orderIdToDelete;
  const path1 = "http://localhost:4500/api/orderProducts/"+orderIdToDelete;
  const handleDeleteConfirmed = ()=>{
    //logic to delete
    axios.delete(`${path}`)
      .then(response => {
        console.log("Response:", response.data);
      })
      .catch(error => {
        console.error("Error while request", error);
      });
    
    axios.delete(`${path1}`)
      .then(response => {
        console.log("Response:", response.data);
      })
      .catch(error => {
        console.error("Error while request", error);
      });
    // order_products.forEach(async orderProduct => {
    //   try{
    //     if(orderProduct.ID_ORDER === orderIdToDelete){
    //       const response = await axios.delete(`${path1}/${orderProduct.ID_PRODUCT}`);
    //       console.log(response.status);
    //     }
    //   }catch(e){
    //     console.log("An error has ocurred: ", e);
    //   }
    // });
    setModalOpen(false);
    setOrderIdToDelete(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setOrderIdToDelete(null);
  }

//end delete
//------------------------------------------------------------------------------
  
  return (
    <div>
      <div style={{display:"flex",alignItems: "center",justifyContent:"center",fontSize:25+"px"}}>
        <h1>My Orders</h1>
      </div>
      <Container
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vh', 
      }}
      >
        
        <div style={{padding: 2 + "em"}}>
          <a href="/add-order"><Button variant="contained">Añadir una orden</Button></a>
        </div>
      </Container>
      
      <div style={{paddingLeft: 8 + 'em', paddingRight: 8 + 'em'}}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell >Order#</TableCell>
                <TableCell>Date</TableCell>
                <TableCell >#Products</TableCell>
                <TableCell >Final Price</TableCell>
                <TableCell >Options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Orders.map((row) => (
                <TableRow
                  key={row.ID_ORDER}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.ID_ORDER}
                  </TableCell>
                  <TableCell >{row.ORDER_N}</TableCell>
                  <TableCell >{row.DATE}</TableCell>
                  <TableCell >{row.N_PRODUCTS}</TableCell>
                  <TableCell >{row.FINAL_PRICE}</TableCell>
                  <TableCell>

                    <Button startIcon={<DeleteIcon/>} variant="contained" color="error" onClick={()=>handleDelete(row.ID_ORDER)}>Delete</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button startIcon={<EditIcon/>} variant="contained" color="success"><a href={`/add-order/?ID_ORDER=${row.ID_ORDER}`}>Editar</a></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Grid container sx={style}>
          <div >
            <h2 id="modal-title">¿Are you sure you want to delete this item?</h2>
            <Button onClick={handleDeleteConfirmed}  variant="contained" color="error">Delete</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button onClick={handleModalClose} variant="outlined" color="primary">Cancel</Button>
          </div>
        </Grid>

      </Modal>
    </div>
  );
}

