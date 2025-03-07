import { Button, Grid, Typography, Stack, Link } from '@mui/material';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { useEnrollmentMutation } from '../../services/api/enrollmentApi';
import { useDispatch, useSelector } from 'react-redux';
import { isAtCourseDetail } from '../../features/auth/authSlice';
import { useTranslation } from "react-i18next";

export const CourseDetailHero = ({ courseData }) => {
  const [enrollment] = useEnrollmentMutation();
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const { courseId, instructorId } = courseData || {};
  const {isAuthenticated, isVerified} = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [t] = useTranslation("global");

  const handleCheckout = async () => {
    setLoading(true);
    dispatch(isAtCourseDetail(true));
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    if (isAuthenticated && !isVerified) {
      navigate('/auth/signup/verification');
      return;
    }
    try {
      if (!courseId || !instructorId) return;
      const data = await enrollment({ courseId: courseId }).unwrap();
      if (data.id) {
        const result = await stripe.redirectToCheckout({ sessionId: data.id });
        if (result.error) {
          console.error(t('courseDetail.stripeCheckoutError'), result.error);
        }
      } else if (data.redirectUrl) {
        navigate(data.redirectUrl);
      } else {
        console.error(t('courseDetail.failedToCreateCheckoutSession'));
      }
    } catch (error) {
      console.error(t('courseDetail.errorDuringCheckout'), error);
      if (error.status === 401) navigate('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid color={'white'} item xs={12}>
      <Grid alignItems={'center'} py={{ xs: 10, md: 15 }}  container>
        <Grid item xs={12} md={5} p={1}>
          <Stack gap={1}>
            <Typography variant="h2">${courseData?.price}</Typography>
            <Typography variant="h4">{courseData?.name}</Typography>
            <Typography variant="bsr">{courseData?.description}</Typography>
            <Typography variant="bsr">
              {t('courseDetail.createdBy')} :{' '}
              {instructorId && (
                <Link
                  sx={{
                    color: 'white',
                    textUnderlineOffset: 3,
                    cursor: 'pointer',
                    ':hover': {
                      textDecoration: 'underline',
                    },
                  }}
                  onClick={() =>
                    navigate(`/instructor-profile/${instructorId}`)
                  }
                >
                  {courseData.instructor.firstName +
                    ' ' +
                    courseData?.instructor?.lastName}
                </Link>
              )}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={2} display={{ xs: 'none', md: 'block' }} />
        <Grid item xs={12} md={5} p={1}>
          <Stack display={'flex'} flexDirection={'column'} gap={1}>
            <MediaPlayer title="Sprite Fight" src={courseData?.previewVideoUrl}>
              <MediaProvider />
              <DefaultVideoLayout
                thumbnails={courseData?.thumbnailUrl}                
                icons={defaultLayoutIcons}
                noAudioGain={true}
                noKeyboardAnimations={true}
                noModal={true}
                slot={{
                  pipButton: null,
                }}
                slots={{
                  pipButton: null,
                  googleCastButton: null,
                }}
              />
            </MediaPlayer>
            <Stack display={'flex'} flexDirection={'column'} gap={1}>
              <Link>
                <Button
                  onClick={handleCheckout}
                  fullWidth
                  color="secondary"
                  variant="contained"
                  disabled={!stripe || loading}
                >
                  <Typography
                    variant="bmd"
                    color={!stripe || loading ? 'common.white' : 'primary'}
                  >
                    {loading ?  t('courseDetail.processing') : t('courseDetail.enroll')}
                  </Typography>
                </Button>
              </Link>
              {/* <Button
                sx={{
                  backgroundColor: 'tertiary.main',
                  color: 'tertiary.contrastText',
                }}
                variant="contained"
              >
                Add to Wishlist
              </Button> */}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
};
