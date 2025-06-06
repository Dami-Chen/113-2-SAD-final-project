PGDMP      1                }            SAD113-2    17rc1    17rc1                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false                       1262    66189    SAD113-2    DATABASE     �   CREATE DATABASE "SAD113-2" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Chinese (Traditional)_Taiwan.950';
    DROP DATABASE "SAD113-2";
                     postgres    false            �            1259    66204    dorm    TABLE     k   CREATE TABLE public.dorm (
    dorm_name character varying(50) NOT NULL,
    area character varying(50)
);
    DROP TABLE public.dorm;
       public         heap r       postgres    false            �            1259    66233    joined_order    TABLE     �   CREATE TABLE public.joined_order (
    username character varying(50) NOT NULL,
    order_id character varying(50) NOT NULL,
    quantity integer
);
     DROP TABLE public.joined_order;
       public         heap r       postgres    false            �            1259    66249    ordercomment    TABLE     �   CREATE TABLE public.ordercomment (
    comment_id integer NOT NULL,
    order_id character varying(50),
    username character varying(50),
    message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
     DROP TABLE public.ordercomment;
       public         heap r       postgres    false            �            1259    66248    ordercomment_comment_id_seq    SEQUENCE     �   CREATE SEQUENCE public.ordercomment_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.ordercomment_comment_id_seq;
       public               postgres    false    222                       0    0    ordercomment_comment_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.ordercomment_comment_id_seq OWNED BY public.ordercomment.comment_id;
          public               postgres    false    221            �            1259    66221    orders    TABLE     �  CREATE TABLE public.orders (
    order_id character varying(50) NOT NULL,
    host_username character varying(50),
    item_name character varying(100),
    quantity integer,
    total_price integer,
    unit_price numeric(10,2),
    image_url text,
    information text,
    share_method character varying(100),
    share_location character varying(100),
    stop_at_num integer,
    stop_at_date date,
    comment text,
    hashtag text,
    pay_method character varying(50)
);
    DROP TABLE public.orders;
       public         heap r       postgres    false            �            1259    66209    users    TABLE     �  CREATE TABLE public.users (
    username character varying(50) NOT NULL,
    nickname character varying(50),
    real_name character varying(100),
    password character varying(100) NOT NULL,
    email character varying(100),
    school character varying(100),
    student_id character varying(20),
    dorm character varying(50),
    score integer,
    phone character varying(20)
);
    DROP TABLE public.users;
       public         heap r       postgres    false            g           2604    66268    ordercomment comment_id    DEFAULT     �   ALTER TABLE ONLY public.ordercomment ALTER COLUMN comment_id SET DEFAULT nextval('public.ordercomment_comment_id_seq'::regclass);
 F   ALTER TABLE public.ordercomment ALTER COLUMN comment_id DROP DEFAULT;
       public               postgres    false    222    221    222            
          0    66204    dorm 
   TABLE DATA           /   COPY public.dorm (dorm_name, area) FROM stdin;
    public               postgres    false    217   |%                 0    66233    joined_order 
   TABLE DATA           D   COPY public.joined_order (username, order_id, quantity) FROM stdin;
    public               postgres    false    220   �%                 0    66249    ordercomment 
   TABLE DATA           [   COPY public.ordercomment (comment_id, order_id, username, message, created_at) FROM stdin;
    public               postgres    false    222   (&                 0    66221    orders 
   TABLE DATA           �   COPY public.orders (order_id, host_username, item_name, quantity, total_price, unit_price, image_url, information, share_method, share_location, stop_at_num, stop_at_date, comment, hashtag, pay_method) FROM stdin;
    public               postgres    false    219   �&                 0    66209    users 
   TABLE DATA           w   COPY public.users (username, nickname, real_name, password, email, school, student_id, dorm, score, phone) FROM stdin;
    public               postgres    false    218   �'                  0    0    ordercomment_comment_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.ordercomment_comment_id_seq', 1, false);
          public               postgres    false    221            j           2606    66208    dorm dorm_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.dorm
    ADD CONSTRAINT dorm_pkey PRIMARY KEY (dorm_name);
 8   ALTER TABLE ONLY public.dorm DROP CONSTRAINT dorm_pkey;
       public                 postgres    false    217            p           2606    66237    joined_order joined_order_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.joined_order
    ADD CONSTRAINT joined_order_pkey PRIMARY KEY (username, order_id);
 H   ALTER TABLE ONLY public.joined_order DROP CONSTRAINT joined_order_pkey;
       public                 postgres    false    220    220            r           2606    66257    ordercomment ordercomment_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.ordercomment
    ADD CONSTRAINT ordercomment_pkey PRIMARY KEY (comment_id);
 H   ALTER TABLE ONLY public.ordercomment DROP CONSTRAINT ordercomment_pkey;
       public                 postgres    false    222            n           2606    66227    orders orders_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public                 postgres    false    219            l           2606    66215    users users_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (username);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    218            u           2606    66243 '   joined_order joined_order_order_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.joined_order
    ADD CONSTRAINT joined_order_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id);
 Q   ALTER TABLE ONLY public.joined_order DROP CONSTRAINT joined_order_order_id_fkey;
       public               postgres    false    219    4718    220            v           2606    66238 '   joined_order joined_order_username_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.joined_order
    ADD CONSTRAINT joined_order_username_fkey FOREIGN KEY (username) REFERENCES public.users(username);
 Q   ALTER TABLE ONLY public.joined_order DROP CONSTRAINT joined_order_username_fkey;
       public               postgres    false    220    218    4716            w           2606    66258 '   ordercomment ordercomment_order_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ordercomment
    ADD CONSTRAINT ordercomment_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id);
 Q   ALTER TABLE ONLY public.ordercomment DROP CONSTRAINT ordercomment_order_id_fkey;
       public               postgres    false    4718    219    222            x           2606    66263 '   ordercomment ordercomment_username_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ordercomment
    ADD CONSTRAINT ordercomment_username_fkey FOREIGN KEY (username) REFERENCES public.users(username);
 Q   ALTER TABLE ONLY public.ordercomment DROP CONSTRAINT ordercomment_username_fkey;
       public               postgres    false    4716    218    222            t           2606    66228     orders orders_host_username_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_host_username_fkey FOREIGN KEY (host_username) REFERENCES public.users(username);
 J   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_host_username_fkey;
       public               postgres    false    4716    218    219            s           2606    66216    users users_dorm_fkey    FK CONSTRAINT     w   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_dorm_fkey FOREIGN KEY (dorm) REFERENCES public.dorm(dorm_name);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_dorm_fkey;
       public               postgres    false    218    4714    217            
   g   x�{�t�/:z9�-X�|�ާ���t<m]�rɊ�{:���w����щW���� ������XTT1v
~m�k�i{ں]۳i�O�s�ι��c���� ���         %   x�+-N-2�4�4�*��8�8��,c ː+F��� ���         �   x�]̿�@ ��^�M�wW�>�E�`` v:�Kj�J՟A*&*�J^�~G'�����K>�Qm4�����b������H�+���ϔx����K7��F��ML�A�:ʦ��u����;��y��VyG���;��]5�.p��686a���
o����
=�_e:~DI�	\V7,��I� �| ��eC         �   x�3�LL����|�p��)�o��id D��z@2���N[�����⹜O�n~�����Owo�J�X��dG7HɄ�g3��6�|�b���i/6� r_N����|6}��)+�Nn�|޿�e����/��>���bo�����8K�S�9_��:��̀��/�=oY��]=@=[1����T�H�����@"� 9����{z���ڿ��iϷ�@���������� &�=         Z   x�KL����LL�LL�L�c������Ov4����J�S�9KK9K�$���tW�R#�R#N��NT��`�Ɯ6�ҧ�g#���qqq >�     