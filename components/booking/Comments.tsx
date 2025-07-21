import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { MessageSquare, Send, Edit2, Trash2, Save, X } from 'lucide-react';
import { useSettings } from '../SettingsContext';
import { Comment } from '../../types/booking';

interface CommentsProps {
  comments: Comment[];
  onAddComment: (comment: string) => void;
  onEditComment: (commentId: string, newMessage: string) => void;
  onRemoveComment: (commentId: string) => void;
  username: string;
}

export function Comments({ comments, onAddComment, onEditComment, onRemoveComment, username }: CommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const { getTextSizeClasses } = useSettings();
  const textClasses = getTextSizeClasses();

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const handleStartEdit = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditText(comment.message);
  };

  const handleSaveEdit = () => {
    if (editingComment && editText.trim()) {
      onEditComment(editingComment, editText.trim());
      setEditingComment(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditText('');
  };

  const handleRemoveComment = (commentId: string) => {
    if (window.confirm('Are you sure you want to remove this comment?')) {
      onRemoveComment(commentId);
    }
  };

  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className={`${textClasses.base} flex items-center text-slate-900`}>
          <div className="flex items-center justify-center w-8 h-8 bg-slate-100 rounded-lg mr-3">
            <MessageSquare className="h-5 w-5 text-slate-600" />
          </div>
          Comments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className={`${textClasses.base} min-h-[100px] border-slate-200 focus:border-blue-500 touch-manipulation`}
          />
          <Button 
            onClick={handleAddComment} 
            className={`${textClasses.base} bg-blue-600 hover:bg-blue-700 text-white h-10 touch-manipulation`}
            disabled={!newComment.trim()}
          >
            <Send className="h-4 w-4 mr-2" />
            Add Comment
          </Button>
        </div>

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-t border-slate-200 pt-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className={`${textClasses.small} font-medium text-slate-900`}>
                    {comment.user === username ? 'You' : comment.user}
                  </p>
                  <p className={`${textClasses.small} text-slate-500`}>
                    {new Date(comment.timestamp).toLocaleString()}
                  </p>
                </div>
                {comment.user === username && (
                  <div className="flex items-center space-x-2 ml-4">
                    {editingComment === comment.id ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSaveEdit}
                          className="h-8 w-8 p-0"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelEdit}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStartEdit(comment)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveComment(comment.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {editingComment === comment.id ? (
                <Textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className={`${textClasses.base} min-h-[80px] border-slate-200 focus:border-blue-500 touch-manipulation`}
                />
              ) : (
                <p className={`${textClasses.small} text-slate-700`}>{comment.message}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}