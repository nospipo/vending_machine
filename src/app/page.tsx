'use client';

import { useState } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  Box,
  Card,
  CardContent,
  CardMedia,
  Snackbar,
  Alert,
  Modal,
  Fade,
  useTheme,
  alpha,
  CircularProgress
} from '@mui/material';
import { initialVendingMachineState, Juice } from '../data/mockData';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
};

export default function Home() {
  const theme = useTheme();
  const [state, setState] = useState(initialVendingMachineState);
  const [selectedJuice, setSelectedJuice] = useState<Juice | null>(null);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState<Juice[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningType, setWarningType] = useState<'money' | 'stock'>('money');
  const [lastPurchase, setLastPurchase] = useState<{
    juice: Juice;
    change: number;
  } | null>(null);

  const handleInsertMoney = (amount: number) => {
    setState(prev => ({
      ...prev,
      insertedMoney: prev.insertedMoney + amount
    }));
  };

  const handleSelectJuice = async (juice: Juice) => {
    setSelectedJuice(juice);
    if (state.insertedMoney < juice.price) {
      setWarningType('money');
      setShowWarningModal(true);
      return;
    }
    if (juice.stock <= 0) {
      setWarningType('stock');
      setShowWarningModal(true);
      return;
    }

    // Start loading
    setIsLoading(true);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Process purchase
    const change = state.insertedMoney - juice.price;
    const updatedJuices = state.juices.map(j => 
      j.id === juice.id ? { ...j, stock: j.stock - 1 } : j
    );

    setState(prev => ({
      ...prev,
      juices: updatedJuices,
      totalMoney: prev.totalMoney + juice.price,
      insertedMoney: 0
    }));

    setPurchasedItems(prev => [...prev, juice]);
    setLastPurchase({ juice, change });
    setIsLoading(false);
    setShowModal(true);
  };

  const handleCloseWarningModal = () => {
    setShowWarningModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setLastPurchase(null);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
      py: 4
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            mb: 4
          }}
        >
          เครื่องขายน้ำผลไม้อัตโนมัติ
        </Typography>

        <Grid container spacing={3}>
          {/* Product Display */}
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 3,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ShoppingCartIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  เลือกน้ำผลไม้
                </Typography>
              </Box>
              <Grid container spacing={3}>
                {state.juices.map((juice) => (
                  <Grid item xs={12} sm={6} md={4} key={juice.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        opacity: juice.stock === 0 ? 0.5 : 1,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: theme.shadows[8],
                        }
                      }}
                      onClick={() => handleSelectJuice(juice)}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={juice.image}
                        alt={juice.name}
                        sx={{
                          objectFit: 'cover',
                          backgroundColor: '#f5f5f5',
                          transition: 'transform 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          {juice.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                          ราคา: {juice.price} บาท
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color={juice.stock > 0 ? "success.main" : "error.main"}
                          sx={{ fontWeight: 'medium' }}
                        >
                          {juice.stock > 0 ? `คงเหลือ: ${juice.stock} ขวด` : 'สินค้าหมด'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Control Panel */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 3,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                mb: 3
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LocalAtmIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  ควบคุม
                </Typography>
              </Box>
              <Box sx={{ 
                mb: 3, 
                p: 2, 
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1)
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  เงินที่หยอด: {state.insertedMoney} บาท
                </Typography>
              </Box>
              <Grid container spacing={1}>
                {[5, 10, 20, 50, 100].map((amount) => (
                  <Grid item xs={4} key={amount}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleInsertMoney(amount)}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        fontWeight: 'bold',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        }
                      }}
                    >
                      {amount} บาท
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Purchase History */}
            <Paper 
              elevation={3}
              sx={{ 
                p: 3,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <HistoryIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  ประวัติการซื้อ
                </Typography>
              </Box>
              {purchasedItems.map((item, index) => (
                <Box 
                  key={index}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    '&:last-child': { mb: 0 }
                  }}
                >
                  <Typography>
                    {item.name} - {item.price} บาท
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>

        {/* Warning Modal */}
        <Modal
          open={showWarningModal}
          onClose={handleCloseWarningModal}
          closeAfterTransition
        >
          <Fade in={showWarningModal}>
            <Box sx={{
              ...modalStyle,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                color: theme.palette.warning.main
              }}>
                {warningType === 'money' ? (
                  <WarningIcon sx={{ fontSize: 40, mr: 1 }} />
                ) : (
                  <ErrorOutlineIcon sx={{ fontSize: 40, mr: 1 }} />
                )}
                <Typography 
                  variant="h5" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 'bold',
                  }}
                >
                  {warningType === 'money' ? 'เงินไม่เพียงพอ' : 'สินค้าหมด'}
                </Typography>
              </Box>
              <Box sx={{ 
                p: 2, 
                mb: 2, 
                borderRadius: 2,
                bgcolor: alpha(theme.palette.warning.main, 0.05)
              }}>
                <Typography variant="body1" gutterBottom>
                  {warningType === 'money' 
                    ? `กรุณาหยอดเงินเพิ่มอีก ${selectedJuice ? selectedJuice.price - state.insertedMoney : 0} บาท`
                    : 'ขออภัย สินค้าหมดแล้ว กรุณาเลือกสินค้าอื่น'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  onClick={handleCloseWarningModal}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    fontWeight: 'bold',
                    bgcolor: theme.palette.warning.main,
                    '&:hover': {
                      bgcolor: theme.palette.warning.dark,
                    }
                  }}
                >
                  ตกลง
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>

        {/* Loading Modal */}
        <Modal
          open={isLoading}
          closeAfterTransition
        >
          <Fade in={isLoading}>
            <Box sx={{
              ...modalStyle,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}>
              <CircularProgress 
                size={60} 
                thickness={4}
                sx={{ 
                  color: theme.palette.primary.main,
                  mb: 2
                }} 
              />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                กำลังจัดเตรียมสินค้า...
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                กรุณารอสักครู่
              </Typography>
            </Box>
          </Fade>
        </Modal>

        {/* Purchase Success Modal */}
        <Modal
          open={showModal}
          onClose={handleCloseModal}
          closeAfterTransition
        >
          <Fade in={showModal}>
            <Box sx={{
              ...modalStyle,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                color: theme.palette.success.main
              }}>
                <CheckCircleIcon sx={{ fontSize: 40, mr: 1 }} />
                <Typography 
                  variant="h5" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 'bold',
                  }}
                >
                  ซื้อสำเร็จ!
                </Typography>
              </Box>
              {lastPurchase && (
                <>
                  <Box sx={{ 
                    p: 2, 
                    mb: 2, 
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05)
                  }}>
                    <Typography variant="body1" gutterBottom>
                      คุณได้รับ: {lastPurchase.juice.name}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      ราคา: {lastPurchase.juice.price} บาท
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      เงินทอน: {lastPurchase.change} บาท
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      สินค้าคงเหลือ: {lastPurchase.juice.stock} ขวด
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      variant="contained" 
                      onClick={handleCloseModal}
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        fontWeight: 'bold'
                      }}
                    >
                      ตกลง
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Fade>
        </Modal>

        <Snackbar
          open={showMessage}
          autoHideDuration={3000}
          onClose={() => setShowMessage(false)}
        >
          <Alert 
            severity="info" 
            onClose={() => setShowMessage(false)}
            sx={{ 
              borderRadius: 2,
              boxShadow: theme.shadows[3]
            }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
} 