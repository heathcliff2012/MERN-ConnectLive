import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useRef, useState } from 'react'
import { addPost } from '../lib/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { ImagePlus, X, Loader2 } from 'lucide-react';

const AddNewPostPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const fileInputRef = useRef(null); // Reference to trigger hidden input
    
    const [textData, setTextData] = useState({
        text: '',
        body: '',
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const { mutate: addPostMutate, isPending, error } = useMutation({
        mutationFn: addPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success('Post added successfully');
            navigate('/user-profile');
        },
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setSelectedFile(null);
        setPreviewImage(null);
        if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input value
    };

    const handleAddPost = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("text", textData.text);
        formData.append("body", textData.body);
        if (selectedFile) {
            formData.append("image", selectedFile);
        }
        addPostMutate(formData);
    }

    console.log("AddNewPostPage render:", { textData, selectedFile, previewImage, isPending, error });

    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-center mb-8 text-primary">Create New Post</h1>
                
                <div className="card bg-base-200 shadow-xl border border-base-300">
                    <div className="card-body p-6 sm:p-8">
                        <form onSubmit={handleAddPost} className="space-y-6">
                            
                            {/* Title Input */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium text-base">Post Title</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Give your post a catchy title"
                                    className="input input-bordered w-full focus:input-primary"
                                    value={textData.text}
                                    onChange={(e) => setTextData({ ...textData, text: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Image Upload Area */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium text-base">Media</span>
                                </label>

                                {/* Hidden Input */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />

                                {/* Upload Trigger / Preview Area */}
                                {!previewImage ? (
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-base-content/20 rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-base-100 transition-all group"
                                    >
                                        <div className="p-4 rounded-full bg-base-300 group-hover:bg-primary/10 transition-colors mb-3">
                                            <ImagePlus className="w-8 h-8 text-base-content/50 group-hover:text-primary transition-colors" />
                                        </div>
                                        <p className="text-sm font-medium text-base-content/70 group-hover:text-primary">
                                            Click to upload an image
                                        </p>
                                        <p className="text-xs text-base-content/40 mt-1">
                                            JPG, PNG up to 5MB
                                        </p>
                                    </div>
                                ) : (
                                    <div className="relative rounded-xl overflow-hidden border border-base-content/10 group h-64 bg-black">
                                        <img 
                                            src={previewImage} 
                                            alt="Preview" 
                                            className="w-full h-full object-contain opacity-90"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-3 right-3 btn btn-circle btn-sm btn-error shadow-lg bg-error text-white border-none hover:scale-110 transition-transform"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Body Textarea */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium text-base">Content</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-32 w-full focus:textarea-primary text-base leading-relaxed"
                                    placeholder="Share your thoughts..."
                                    value={textData.body}
                                    onChange={(e) => setTextData({ ...textData, body: e.target.value })}
                                />
                            </div>

                            {/* Error Display */}
                            {error && (
                                <div className="alert alert-error shadow-sm rounded-lg">
                                    <X size={20} />
                                    <span>{error.response?.data?.message || "An error occurred"}</span>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-full text-lg font-medium shadow-md hover:shadow-lg transition-all"
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2" />
                                            Publishing...
                                        </>
                                    ) : (
                                        'Publish Post'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddNewPostPage;