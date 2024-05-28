import React, { useContext, useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  FormControl,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Toaster, toast } from 'react-hot-toast';
import { UserContext } from '../App';
import axios from 'axios';

const RequestPage = () => {
  const { userAuth, userAuth: { username, fullname } } = useContext(UserContext);
  const [formData, setFormData] = useState({
    fullName: fullname,
    userName: username,
    email: '',
    message: '',
    agreeTerms: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const checkUserRequests = async () => {
      try {
        const response = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-user-requests", {}, {
          headers: {
            "Authorization": `Bearer ${userAuth.access_token}`
          }
        });
        if (response.data.requests.length > 0) {
          setIsSubmitted(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkUserRequests();
  }, [userAuth]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.fullName || !formData.email || !formData.message) {
        throw new Error('Please fill out all fields.');
      }
      await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-request", formData, {
        headers: {
          "Authorization": `Bearer ${userAuth.access_token}`
        }
      });
      toast.success("Request submitted successfully!");
      setIsSubmitted(true);
      setFormData({
        fullName: fullname,
        userName: username,
        email: '',
        message: '',
        agreeTerms: false,
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Toaster />
      <Container component="main" maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
          {isSubmitted ? (
            <>
            <Typography variant="h5" component="h2" gutterBottom sx={{ textAlign: "center" }} color="success.main" fontWeight="bold"  > 
              Wait for Admin to approve your request.
            </Typography>
            <Typography variant="h6" component="h6" gutterBottom sx={{ textAlign: "center" }}   > 
              If you have any questions, please contact us at <a href="mailto:jadavkeshav2005@gmail.com">jadavkeshav2005@gmail.com</a>
          </Typography>
          </>
          ) : (
            <>
              <Typography variant="h5" component="h2" gutterBottom>
                Request for Writer Privileges
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="fullName"
                  name="fullName"
                  label="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="userName"
                  name="userName"
                  label="User Name"
                  value={formData.userName}
                  onChange={handleChange}
                  disabled
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  name="email"
                  type="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Typography variant="body2" color="error" gutterBottom>
                  Make sure the provided email is linked with this account.
                </Typography>
                <TextField
                  margin="normal"
                  fullWidth
                  multiline
                  rows={4}
                  id="message"
                  name="message"
                  label="Tell us why you need writer privileges"
                  value={formData.message}
                  onChange={handleChange}
                />
                <FormControl margin="normal">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.agreeTerms}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            agreeTerms: e.target.checked,
                          })
                        }
                        name="agreeTerms"
                      />
                    }
                    label="I agree to the terms and conditions."
                  />
                </FormControl>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ marginTop: 2 }}
                >
                  Submit Request
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default RequestPage;
