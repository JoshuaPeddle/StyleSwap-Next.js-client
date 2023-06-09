
const API_URL = process.env.NEXT_PUBLIC_IMAGE_SERVER;
export default async function predict(model: string, blob: Blob, setResult: Function, setError: Function, setLoading: Function, variant: number, uuid: string ) {
  const fd = new FormData();
  const file = new File([ blob ], uuid + '.webp', { type: 'image/webp' });
  fd.append('image', file);

  await fetch(API_URL+'generate/'+model+'/'+variant, {method: 'POST', body: fd})
    .then(async (res) => {
      res.blob().then((blob) => {
        try {
          const reader = new FileReader() ;
          reader.onload = function() {
            setResult(this.result);
          } ;
          reader.readAsDataURL(blob) ;
        } catch (e) {
          setError(true);
          setLoading(false);
        }
      });
    }) 
    .catch((err) => {
      setError(true); setLoading(false); 
    });
}

