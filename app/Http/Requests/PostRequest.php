<?php

namespace App\Http\Requests;

use App\Models\Post;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PostRequest extends FormRequest
{
    public function authorize(): bool
    {
        $post = $this->route('post');

        return $post ? $this->user()->can('update', $post) : $this->user() !== null;
    }

    public function rules(): array
    {
        $maxKb = config('site.max_upload_kb');

        return [
            'title' => ['required', 'string', 'min:5', 'max:150'],
            'slug' => [
                'nullable', 'string', 'max:200', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('posts', 'slug')->ignore($this->route('post')),
            ],
            'excerpt' => ['required', 'string', 'min:20', 'max:300'],
            'content' => ['required', 'string', 'min:100', 'max:50000'],
            'category_id' => ['required', 'integer', Rule::exists('categories', 'id')],
            'destination_id' => ['required', 'integer', Rule::exists('destinations', 'id')],
            'status' => ['required', Rule::in([Post::DRAFT, Post::PUBLISHED])],
            'cover_image' => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp', "max:{$maxKb}"],
            'remove_cover_image' => ['sometimes', 'boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'category_id' => 'category',
            'destination_id' => 'destination',
            'cover_image' => 'cover image',
        ];
    }

    public function messages(): array
    {
        return [
            'slug.regex' => 'The slug may only contain lowercase letters, numbers, and single hyphens.',
            'cover_image.max' => 'The cover image may not be larger than '.(config('site.max_upload_kb') / 1024).' MB.',
            'cover_image.uploaded' => 'The cover image failed to upload. It may be larger than the server allows.',
        ];
    }
}
