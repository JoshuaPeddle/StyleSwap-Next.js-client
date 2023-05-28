
import { useEffect, useState, useCallback } from 'react';
import LocalImageLoader from './LocalImageLoader';
import _Image from 'next/image';
import StyleButton from './StyleButton';
import {nextVariant} from '../lib/models.js';
import _predict from '../lib/predict.js';
import {exportImages, exportGIF, exportMP4} from '../lib/ImageExporter.js';
import styles from './TFView.module.css';
import ImagePlaceholder from './ImagePlaceholder';
import {compressImage} from '../lib/compress';

export default function TFView() {
  const [ image, setImage ] = useState(null);
  const [ result, setResult ] = useState(null);
  const [ error, setError ] = useState(false);
  const [ models, setModels ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ message, setMessage ] = useState(null);
  const [ uuid, setUuid ] = useState(null);
  const [ compressed, setCompressed ] = useState(false);
  useEffect(() => {
    generateUUID();
    compressImage(image, setCompressed);
  }, [ image ]);
  const predict =async (model) => {
    if (!compressed) return;
    if (loading) return;
    setResult(null);
    setLoading(true);
    setError(false);
    // Determine variant
    const variant = nextVariant(models[model]);
    _predict(model, compressed, setResult, setError, setLoading, variant, uuid);
  };
  const resultToImage = () => {
    if (!result) return;
    _setImage(result);
    setResult(null);
  };
  // This function sends send a GET request to the generator server to get a url for a random image
  const prefetchImage = async (url) => {
    const img = new Image();
    img.src = url;
  };
  const fetchRandomImage = async () => {
    const res = await fetch('/api/randomImage', {method: 'GET'});
    setImage(null);
    const data = await res.json();
    // Prefetch the image
    prefetchImage(data.url);
    _setImage(data.url);
  };
  const _export_image = () => {
    exportImages(image, result);
  };
  const _export_GIF = () => {
    setLoading(true);
    exportGIF(image, result, setLoading, setError, setMessage);
  };
  const _export_MP4 = () => {
    setLoading(true);
    exportMP4(image, result, setLoading, setError, setMessage);
  };
  const generateUUID = () => {
    let uuid = self.crypto.randomUUID();
    setUuid(uuid);
  };
  const fetchModels = useCallback(async () => {
    // Make a call to /api/models to get the models
    const res = await fetch('/api/models', {method: 'GET'});
    const data = await res.json();
    setModels(data);
  }, []);
  useEffect(() => {
    fetchModels().then(() => {
      fetchRandomImage();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const _setImage = (img) => {
    setImage(img);
    setResult(null);
  };
  return (
    <>
      <div className={styles.topButtonContainer}>    
        <LocalImageLoader setImage={_setImage} />
        <button id='random_image_btn' className={styles.button} onClick={fetchRandomImage} >Random image</button>
      </div>
  
      <div className={styles.images}>
        {image ? <_Image priority={true}  id='src_img' src={image} width="384" height="256" quality={95} alt="" loader={({ src }) => {
          return src; 
        }} unoptimized /> : <ImagePlaceholder loading={true}/>}
        {result ? <_Image id='res_img' src={result} width="384" height="256" alt="" quality={95} /> : <ImagePlaceholder loading={loading}/>}
      </div>

      <div className={styles.modelButtonsContainer}>
        {Object.values(models).map((model) => {
          return <StyleButton  key={model.style} style={model.style} label={model.label} bg={model.background_url} predict={predict}/>;
        })}
      </div>
      <div className={styles.modelButtonsContainer}>
        <button className={styles.button} onClick={resultToImage} >Result to Image</button>
        <button className={styles.button}  onClick={_export_image} >Export Images</button>
        <button className={styles.button}  onClick={_export_GIF} >Export GIF (better compatibility)</button>
        <button className={styles.button}  onClick={_export_MP4} >Export MP4 (Great compatibility)</button>
      </div>

      {error ? <p>There was an error {error}</p>  : ''}

      {message}
    </>
  );
}