import { Box } from '@mui/material';
import { useEffect, useRef} from 'react';
import Slider, { Settings } from 'react-slick';

export default function SimpleSlider({ items, clickedButton }: { items: JSX.Element[], clickedButton: boolean })  {
  const cauroselRef = useRef<Slider>(null);
  const loaded = useRef(false);
  const settings :Settings = {
    infinite: false,
    dots: true,
    speed: 500,
    lazyLoad: 'progressive',
    onLazyLoad: () => {
      if (!clickedButton && cauroselRef.current
        && !loaded.current) {
        cauroselRef.current.slickGoTo(0);
        loaded.current = true;
      }
    },
    slidesToShow: 6,
    slidesToScroll: 6,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          initialSlide: 0,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 0,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 0,
        }
      }
    ]
  };
  useEffect(() => {
    if (!clickedButton && cauroselRef.current && loaded.current) {
      cauroselRef.current.slickGoTo(0);
      loaded.current = false;
    }
  }, [ items, clickedButton ]);
  return (
    <Box className='modelButtonsContainer'
      sx={{
        maxWidth: '100%',
        backgroundColor: 'rgb(255,255,255,0.02)',
        boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
        width: '100%',
        minWidth: '100%',
        pt: '30px',
        pb: '30px',
        px: '30px',
        borderRadius: '10px',
        height: 'fit-content'
      }}>
      <Slider ref={cauroselRef} {...settings}>
        {items.map((item, index) => (
          <Box key={index}>{item}</Box>
        ))}
      </Slider>
    </Box>

  );
};