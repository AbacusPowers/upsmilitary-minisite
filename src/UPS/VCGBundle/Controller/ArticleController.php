<?php

namespace UPS\VCGBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Yaml\Parser;


class ArticleController extends Controller
{   
    /**
     * @Route("/article/{slug}" )
     * @Route("/article/{slug}.html", name="home_article")
     * @Route("/culture-benefits/article/{slug}.html", name="culture_benefits_article")
     * @Route("/transition-guide/article/{slug}.html", name="transition_guide_article")
     */
    public function indexAction($slug)
    {
        if(substr($slug, -5, 5) === '.html') {
            $slug = substr($slug, 0, -5);
        }
        $yaml = new Parser();
        $article = array();
        
        $request = $this->container->get('request');
        $routeName = $request->get('_route');
        try {
            $article = $yaml->parse(file_get_contents( dirname(dirname(__FILE__)). "/Resources/data/articles/$slug.yml"));
        } catch (ParseException $e) {
            printf("Unable to parse the YAML file: %s", $e->getMessage());
        }
//        try {
//            $response = $this->render(
//                'VCGBundle:Layouts:article.html.twig',
//                array('slug' => $slug, 'article' => $article,'route' => $routeName)
//            );
//        } catch (\Exception $ex) {
//            // your conditional code here.
//            $error = new Response(Response::HTTP_NOT_FOUND);
////            throw new \Symfony\Component\HttpKernel\Exception\HttpException(404, "Oops! Page not found");
//            $response = $this->render(
//                'VCGBundle:Page:404.html.twig',
//                array('slug' => $slug, 'error' => $error)
//            );
//        }
        $response = $this->render(
            'VCGBundle:Layouts:article.html.twig',
            array('slug' => $slug, 'article' => $article,'route' => $routeName)
        );
        return $response;
    }
}
