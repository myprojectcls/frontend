import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ImageData {
  _id: string;
  imageUrl: string;
  title: string;
  description: string;
}

const UploadPage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<ImageData[]>([]);
  const [editingImage, setEditingImage] = useState<ImageData | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/images");
      setImages(response.data);
    } catch (error) {
      toast.error("Error fetching images.");
    }
  };

  const handleUpload = async () => {
    if (!image || !title.trim() || !description.trim()) {
      toast.warning("Please fill all fields and select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("description", description);

    try {
      await axios.post("http://localhost:8000/api/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Image uploaded successfully!");
      setImage(null);
      setTitle("");
      setDescription("");
      fetchImages();
    } catch (error) {
      toast.error("Failed to upload image.");
    }
  };

  const handleEdit = async () => {
    if (!editingImage) return;

    const formData = new FormData();
    formData.append("title", editingImage.title);
    formData.append("description", editingImage.description);

    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.put(`http://localhost:8000/api/images/${editingImage._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Image updated successfully!");
      setEditingImage(null);
      setImage(null);
      fetchImages();
    } catch (error) {
      toast.error("Failed to update image.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/images/${id}`);
      toast.success("Image deleted successfully!");
      fetchImages();
    } catch (error) {
      toast.error("Failed to delete image.");
    }
  };

  return (
    <div className="upload-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Upload Image</h2>
      <input type="file" accept="image/jpeg, image/png" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <button className="upload-btn" onClick={handleUpload}>Upload</button>

      <h2>Uploaded Images</h2>
      {images.length === 0 ? (
        <p>No images uploaded.</p>
      ) : (
        <div className="image-grid">
          {images.map((img) => (
            <div key={img._id} className="image-card">
              <img src={`http://localhost:8000${img.imageUrl}`} alt={img.title} />
              <h3>{img.title}</h3>
              <p>{img.description}</p>
              <div className="btn-group">
                <button className="edit-btn" onClick={() => setEditingImage(img)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(img._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingImage && (
        <div className="edit-container">
          <h2>Edit Image</h2>
          <img src={`http://localhost:8000${editingImage.imageUrl}`} alt={editingImage.title} width="200" />
          <input type="file" accept="image/jpeg, image/png" onChange={(e) => setImage(e.target.files?.[0] || null)} />
          <input
            type="text"
            value={editingImage.title}
            onChange={(e) => setEditingImage({ ...editingImage, title: e.target.value })}
          />
          <input
            type="text"
            value={editingImage.description}
            onChange={(e) => setEditingImage({ ...editingImage, description: e.target.value })}
          />
          <div className="btn-group">
            <button className="save-btn" onClick={handleEdit}>Save Changes</button>
            <button className="cancel-btn" onClick={() => setEditingImage(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
